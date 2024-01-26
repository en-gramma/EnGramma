import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';

export const UploadImage = () => {

  const [status, setStatus] = useState(''); 

  //dompurify assaini les données
  const [formData, setFormData] = useState({
    title: DOMPurify.sanitize(''),
    author: DOMPurify.sanitize(''),
    file: null,
  });

  //mise à jour des entrées
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,});
  };

  // upload de l'image avec restriction de taille
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
  
      const response = await axios.post("https://api.cloudinary.com/v1_1/doz6ojndh/image/upload", formData, {
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
      await axios.post(`${apiUrl}/api/images/`, {
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

  // réinitialisation du formulaire
    useEffect(() => {
      if(status === 'success') {
        setFormData({
          title: '',
          author: '',
          file: null,
        })
      }
    }, [status]) 
  return (
<div className="w-full shadow-md rounded-md p-2 md:p-3 bg-white md:m-3 ">
    <h2 className="text-xl font-bold  px-2 py-2 w-full">Ajouter un album</h2>
    <div className="mb-5 mt-2 border-b border-gray-300"></div>
    <form onSubmit={handleSubmit} className="w-full max-w-md  px-8 pt-2 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Titre
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title"
          type="text"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
          Auteur
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="author"
          type="text"
          name="author"
          placeholder="Auteur"
          value={formData.author}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
          Image
        </label>
        <input
          className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="file"
          type="file"
          name="file"
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Ajouter
        </button>
      </div>
    </form>
  </div>
  )
}
