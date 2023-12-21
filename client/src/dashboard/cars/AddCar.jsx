import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';

export const AddCar = () => {

  const [status, setStatus] = useState(''); 

  //dompurify assaini les données
  const [formData, setFormData] = useState({
    title: DOMPurify.sanitize(''),
    year: DOMPurify.sanitize(''),
    price: DOMPurify.sanitize(''),
    km: DOMPurify.sanitize(''),
    fuel: DOMPurify.sanitize(''),
    gearbox: DOMPurify.sanitize(''),
    warrant: DOMPurify.sanitize(''),
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
      await axios.post(`${apiUrl}/api/cars/`, {
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
          year: '',
          price: '',
          km: '',
          fuel: '',
          gearbox: '',
          warrant: '',
          file: null,
        })
      }
    }, [status]) 
  
  return (
    
    <div className="max-w-xl">
      <h1 className="font-bold text-lg mb-4">Ajouter une nouvelle voiture</h1>
      <form onSubmit={handleSubmit} className="">
        <div className="mb-4">
          <label htmlFor="file" className="block mb-2">Image de la voiture</label>
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
          <label htmlFor="title" className="block mb-2">Modèle de la voiture</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border border-gray-400 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="year" className="block mb-2">Année</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="border border-gray-400 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block mb-2">Prix (en €)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border border-gray-400 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="km" className="block mb-2">Kilomètres (en km)</label>
          <input
            type="number"
            id="km"
            name="km"
            value={formData.km}
            onChange={handleChange}
            required
            className="border border-gray-400 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fuel" className="block mb-2">Type de carburant</label>
          <select
            id="fuel"
            name="fuel"
            value={formData.fuel}
            onChange={handleChange}
            required
            className="border border-gray-400 w-full p-1"
          >
            <option value="">Sélectionnez un carburant</option>
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybride">Hybride</option>
            <option value="Electrique">Electrique</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="gearbox" className="block mb-2">Boîte de vitesses</label>
          <select
            id="gearbox"
            name="gearbox"
            value={formData.gearbox}
            onChange={handleChange}
            required
            className="border border-gray-400 w-full p-1"
          >
            <option value="">Sélectionnez une transmission</option>
            <option value="Manuelle">Manuelle</option>
            <option value="Auto">Automatique</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="warrant" className="block mb-2">Garantie (en mois)</label>
          <input
            type="number"
            id="warrant"
            name="warrant"
            value={formData.warrant}
            onChange={handleChange}
            required
            className="border border-gray-400 w-full"
          />
        </div>
        <div className="mb-2">
        {/* affichage d'un message en cas de succes ou echec */}
        {status === 'success' && 
            <p className="text-green-700 font-semibold mb-2">La voiture a été ajoutée avec succes</p>
          }

          {status === 'error' &&
            <p className="text-red-700 font-semibold mb-2">Erreur lors de l'ajout de la voiture</p>
          }
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-re-800 w-full"
          >
            Ajouter la Voiture
          </button>
        </div>
      </form>
    </div>

  );
};


