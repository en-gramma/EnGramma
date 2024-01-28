import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';

export const AddArticle = () => {
  const [status, setStatus] = useState('');
  const [articles, setArticles] = useState([]);

  const [formData, setFormData] = useState({
    text: DOMPurify.sanitize(''),
    name: DOMPurify.sanitize(''),
    country: DOMPurify.sanitize(''),
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
      } catch (err) {
        setStatus('error');
        console.error('Erreur lors de l\'ajout de la voiture :', err.response ? err.response.data : err.message);
      }
    };

  useEffect(() => {
    if(status === 'success') {
      setFormData({
        text: '',
        name: '',
        country: '',
        file: null,
      })
    }
  }, [status]) 

  const deleteArticle = (id) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.delete(`${apiUrl}/api/articles/${id}`, {
        withCredentials: true,
      })
      .then(response => setArticles(articles.filter(article => article.id !== id)))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    async function fetchArticles() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/articles`);
        setArticles(response.data);

      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    }
    fetchArticles();
  }, []);

  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur press</h2>
      <div className="mb-5 mt-2 border-b border-gray-300 "></div>

      <h2 className="text-lg font-bold  px-2 py-2 w-full">Ajouter un article</h2>
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <div className="mb-4">
          <div className="mb-4">
          <label htmlFor="file" className="block mb-2">Logo du média</label>
          <input
            required
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            className="border border-gray-400 w-full"
          />
        </div>
            <textarea className="border p-2 mr-2" placeholder="Text" name="text" value={formData.text} onChange={handleChange} />
            <input className="border p-2 mr-2" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
            <input className="border p-2 mr-2" placeholder="Country" name="country" value={formData.country} onChange={handleChange} />
            <button className="bg-blue-500 text-white p-2" type="submit">Add Article</button>
          </div>
        </div>
      </form>
      <div className="mb-5 mt-2 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full mb-4">Effacer un article</h2>
        {articles.map(article => (
        <div key={article.id} className="">
            <img src={article.image} alt={article.name} className="w-auto h-[75px] object-cover mb-4 rounded" />
            <h2 className="mb-2"><span className='text-md font-bold '>{article.name}</span> <span className='italic'>({article.country})</span></h2>
            <p className="text-gray-700">{article.text}</p>
            <button onClick={() => deleteArticle(article.id)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Effacer</button>
        </div>
        ))}
    </div>
  );
};