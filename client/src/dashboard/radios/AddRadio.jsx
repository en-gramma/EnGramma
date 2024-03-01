import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';
import { AddRadioFr } from './AddRadioFr';
import fr from "../../assets/fr.png";
import en from "../../assets/en.png";
import { useTranslation } from 'react-i18next';

export const AddRadio = () => {
  const [status, setStatus] = useState('');
  const [formStatus, setFormStatus] = useState(null);
  const [radios, setRadios] = useState([]);
  const formRef = useRef();
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    description: DOMPurify.sanitize(''),
    country: DOMPurify.sanitize(''),
    pays: DOMPurify.sanitize(''),
    descriptionEn: DOMPurify.sanitize(''),
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
    const frenchTextRegex = /^[a-zA-Z0-9àâäéèêëïîôöùûüçÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ' -]+$/;
    const descriptionRegex = /^[\w\W\s]*$/;

    // Validation
    if (!frenchTextRegex.test(formData.pays) || !frenchTextRegex.test(formData.country)) {
      alert('Erreur : Les champs contiennent des caractères non valides');
      return;
    }

    if (!descriptionRegex.test(formData.description) || !descriptionRegex.test(formData.descriptionEn))
    {
      alert('Erreur : Les champs contiennent des caractères non valides');
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
        await axios.post(`${apiUrl}/api/radios/`, {
          ...formData,
          image: url,
          filename: filename
        }, {
          withCredentials: true,
        });
        setStatus('success');
        fetchRadios();
      } catch (err) {
        setStatus('error');
        console.error('Erreur lors de l\'ajout de la radio');
      }
    };

  // réinitialisation du formulaire
  useEffect(() => {
    if(status === 'success') {
      formRef.current.reset();
      setFormData({
        description: '',
        country: '',
        pays: '',
        descriptionEn: '',
        file: null,
      })
    }
  }, [status]) 

  const deleteRadio = (id) => {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette radio?');
    if (!confirmation) {
      return;
    }
    const apiUrl = process.env.REACT_APP_API_URL;
    setFormStatus('loading');
    axios.delete(`${apiUrl}/api/radios/${id}`, {
        withCredentials: true,
      })
      .then(response => {
        setRadios(radios.filter(radio => radio.id !== id));
        setFormStatus('success');
      })
      .catch(error => {
        console.error(error);
        setFormStatus('error');
      });
  };

  const fetchRadios = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/radios`);
      setRadios(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données');
    }
  };
  
  useEffect(() => {
    fetchRadios();
  }, []);

  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur radio</h2>
      <div className="mb-5 mt-2 border-b border-gray-300 "></div>

      <h2 className="text-lg font-bold  px-2 py-2 w-full">Ajouter une radio internationale</h2>
      <form ref={formRef} onSubmit={handleSubmit} className='w-full max-w-lg md:mx-2'>
      <div className="p-4">
        <div className="mb-4">
            <label htmlFor="file" className="block mb-2">Logo de la radio</label>
            <p className='italic text-md mb-2'>Idéalement de taille 100x100px et au format .png transparent</p>
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
        <div className='flex items-center'>
        <h2 className="text-lg py-3 mr-2" style={{ lineHeight: '1.5' }}>Radios en français</h2>
        <img src={fr} alt="" className='w-[25px] h-[15px] align-middle' />
      </div>
        </div>
        <div className="mb-4">
          <span>Pays</span>
            <input required className="border p-2 w-full" placeholder="" name="country" value={formData.country} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <span>Infos complémentaires</span>
            <input className="border p-2 w-full" placeholder="" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="mb-5 mt-2 border-b border-gray-300 "></div>

        <div className="mb-4">
        <div className='flex items-center'>
        <h2 className="text-lg py-3 mr-2" style={{ lineHeight: '1.5' }}>Radios en anglais</h2>
        <img src={en} alt="" className='w-[25px] h-[15px] align-middle' />
      </div>
        </div>
        <div className="mb-4">
          <span>Pays</span>
            <input required className="border p-2 w-full" placeholder="" name="pays" value={formData.pays} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <span>Infos complémentaires</span>
            <input className="border p-2 w-full" placeholder="" name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} />
        </div>

        {status === 'success' && <div className="text-green-500">La radio a été ajouté avec succès!</div>}
        {status === 'error' && <div className="text-red-500">Erreur lors de l'ajout de la radio</div>}
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
        </div>
      </form>

      <div className="mb-5 mt-2 border-b border-gray-300 "></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full mb-4">Effacer une radio internationale</h2>
        {formStatus === 'success' && <div className="text-green-500">La radio a été effacé avec succès!</div>}
        {formStatus === 'error' && <div className="text-red-500">Erreur lors de l'effacement de la radio</div>}
        <div className="grid md:grid-cols-3 gap-4 ">
            {radios.map(radio => (
              
              <div key={radio.id} className="p-4 flex flex-col items-center ">
                <button className="w-[300px] mb-2  bg-red-500 text-white p-2 rounded" onClick={() => deleteRadio(radio.id)}>Effacer</button>
                <div className='bg-gray-100 border w-[300px] text-center px-4 rounded'>
                  <img src={radio.image} alt={radio.name} className="w-auto mx-auto h-[75px] object-cover mb-4 rounded pt-1" />
                  <div className="my-1 border-b border-gray-300 "></div>
                  <div className='font-semibold mb-2'>
                  {DOMPurify.sanitize(t(i18n.language === 'en' ? radio.pays : radio.country).replace(/\n/g, '<br />'))}
                </div>
                <div className='text-gray-700'>
                  {DOMPurify.sanitize(t(i18n.language === 'en' ? radio.descriptionEn : radio.description).replace(/\n/g, '<br />'))}
                </div>
                </div>
              </div>
            ))}
            
          </div>
        <div className="mb-5 mt-2 border-b border-gray-300 "></div>
        <AddRadioFr />
    </div>
  );
};