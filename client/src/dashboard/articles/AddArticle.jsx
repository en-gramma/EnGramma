import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';
import fr from "../../assets/fr.png";
import en from "../../assets/en.png";
import { MdOutlineFormatQuote } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

export const AddArticle = () => {
  const [status, setStatus] = useState('');
  const [formStatus, setFormStatus] = useState(null);
  const [articles, setArticles] = useState([]);
  const formRef = useRef();
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    text: DOMPurify.sanitize(''),
    textEn: DOMPurify.sanitize(''),
    name: DOMPurify.sanitize(''),
    country: DOMPurify.sanitize(''),
    header: DOMPurify.sanitize(''),
    headerEn: DOMPurify.sanitize(''),
    file: null,

  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,});
  };

  const uploadImage = async (file) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Le fichier dépasse 5Mo');
    }
 
    try {
      //setup cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  
      const response = await axios.post("https://api.cloudinary.com/v1_1/dvfel75pw/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      // récupération de l'url et du nom du fichier
      return {
        url: response.data.url, 
        filename: file.name
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regex pour la validation
    const frenchTextRegex = /^[\w\W\s]*$/;

    // Validation
    if (!frenchTextRegex.test(formData.text)) {
      alert('Le texte contient des caractères non valides.');
      return;
    }
    if (!frenchTextRegex.test(formData.name)) {
      alert('Le nom contient des caractères non valides.');
      return;
    }
    if (!frenchTextRegex.test(formData.country)) {
      alert('Le pays contient des caractères non valides.');
      return;
    }
    if (!frenchTextRegex.test(formData.header)) {
      alert('L\'en-tête contient des caractères non valides.');
      return;
    }

    // empeche l'envoi du formulaire si le fichier est trop lourd
    if (formData.file && formData.file.size > 5 * 1024 * 1024) {
        alert("Le fichier dépasse 5 Mo");
        return;
        }

    const {url, filename} = await uploadImage(formData.file);

    try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.post(`${apiUrl}/api/articles/`, {
          ...formData,
          image: url,
          filename: filename
        }, {
          withCredentials: true,
        });
        setStatus('success');
        fetchArticles();
      } catch (err) {
        setStatus('error');
        console.error('Erreur lors de l\'ajout de la voiture :', err.response ? err.response.data : err.message);
      }
    };

  useEffect(() => {
    if(status === 'success') {
      formRef.current.reset();
      setFormData({
        text: '',
        textEn: '',
        name: '',
        country: '',
        header: '',
        headerEn: '',
        file: null,
      })
    }
  }, [status]) 

  const deleteArticle = (id) => {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?');
    if (!confirmation) {
      return;
    }
    const apiUrl = process.env.REACT_APP_API_URL;
    setFormStatus('loading');
    axios.delete(`${apiUrl}/api/articles/${id}`, {
        withCredentials: true,
      })
      .then(response => {
        setArticles(articles.filter(article => article.id !== id));
        setFormStatus('success');
      })
      .catch(error => {
        console.error(error);
        setFormStatus('error');
      });
  };

  const fetchArticles = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };
  
  useEffect(() => {
    fetchArticles();
  }, []);

  const Article = ({ article }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const text = t(i18n.language === 'en' ? article.textEn : article.text);
    const truncatedText = text.split(' ').length > 25 ? text.split(' ').slice(0, 25).join(' ') + '...' : text; 
  
    return (
      <div key={article.id} className="p-4 flex flex-col items-center  mx-auto">
        <button onClick={() => deleteArticle(article.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold px-1   py-2 rounded mb-2 text-center animate-fade-up shadow-md">Supprimer</button>
          <img src={article.image} alt={article.name} className="w-auto h-[75px] w-[75px] object-contains mb-4 rounded rounded-full" />
            <h2 className="mb-2"><span className='font-bold  text-lg'>{article.name}</span><span className='italic '>({article.country})</span></h2>
            {t(i18n.language === 'en' ? article.headerEn : article.header) ? (
              <div className='text-center font-semibold mb-2'>
                {t(i18n.language === 'en' ? article.headerEn : article.header).split('\n').map((text, index) => (
                  <React.Fragment key={index}>
                    {text}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div style={{ height: '1em' }} className='mb-2' /> 
            )}
        <div className='flex items-center text-center'>
          <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
            <MdOutlineFormatQuote className='text-2xl text-orange2 ml-2 scale-x-[-1] mr-3' />
          </div>
          <div className='text-center'>
            {(isExpanded ? text : truncatedText).split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
          <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
            <MdOutlineFormatQuote className='text-2xl text-orange2 ml-2  ml-3' />
          </div>
        </div>
        {text.split(' ').length > 30 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="underline text-orange2">
            {isExpanded ? 'Voir moins' : 'Voir plus'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur presse</h2>
      <div className="mb-5 mt-2 border-b border-gray-300 "></div>

      <h2 className="text-lg font-bold  px-2 py-2 w-full">Ajouter un article</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='w-full max-w-lg md:mx-2'>
      <div className="p-4">
        <div className="mb-4">
            <label htmlFor="file" className="block mb-2">Logo du média</label>
            <p className='italic text-md mb-2'>Idéalement de taille 100x100px, rond et au format .png</p>
            <input
            required
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            className="border border-gray-400 w-full"
            />
        </div>

        <div className="mb-4">
          <span className='mb-2'>Nom du média</span>
            <input className="border p-2 w-full" placeholder="Nom du média" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <span className='mb-2'>Pays</span>
            <input className="border p-2 w-full" placeholder="Exemple: FR, USA" name="country" value={formData.country} onChange={handleChange} />
        </div>
          
        <div className="mb-4 flex items-center">
           <span className=''>En-tête en français</span>
            <img src={fr} alt="" className='w-[25px] h-[15px] align-middle ml-2' />   
        </div>
          <input className="border p-2 w-full" placeholder="Exemple:'Album du mois' (Optionnel)" name="header" value={formData.header} onChange={handleChange} />
        
        <div className="mb-4 flex items-center mt-2">
          <span className=''>Description en français </span>
          <img src={fr} alt="" className='w-[25px] h-[15px] align-middle ml-2' />
        </div>
          <textarea className="border p-2 w-full " placeholder="80 à 100 mots max recommandé, ne pas mettre de guillemets" name="text" value={formData.text} onChange={handleChange} />
        
        <div className="mb-5 mt-2 border-b border-gray-300 "></div>
          <div className="mb-4 flex items-center">
          <span className=''>En-tête en anglais</span>
          <img src={en} alt="" className='w-[25px] h-[15px] align-middle ml-2' /> 
        </div>
        <input className="border p-2 w-full" placeholder="Optionnel Exemple:'Music of the month'" name="headerEn" value={formData.headerEn} onChange={handleChange} />
        <div className="mb-4 flex items-center mt-2">
          <span className=''>Description en anglais </span>
          <img src={en} alt="" className='w-[25px] h-[15px] align-middle ml-2' />    
        </div>
          <textarea className="border p-2 w-full" placeholder="80 à 100 mots max recommandé, ne pas mettre de guillemets" name="textEn" value={formData.textEn} onChange={handleChange} />
        {setStatus === 'success' && <div className="text-green-500">L'article a été ajouté avec succès!</div>}
        {setStatus === 'error' && <div className="text-red-500">Erreur lors de l'ajout de l'article</div>}
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
        </div>
      </form>

      <div className="mb-5 mt-2 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full mb-4">Effacer un article</h2>
        {formStatus === 'success' && <div className="text-green-500">L'article a été effacé avec succès!</div>}
        {formStatus === 'error' && <div className="text-red-500">Erreur lors de l'effacement de l'article</div>}
        <div className="grid md:grid-cols-3 gap-4">

        {articles.map(article => <Article key={article.id} article={article} />)}
        </div>
    </div>
  );
};