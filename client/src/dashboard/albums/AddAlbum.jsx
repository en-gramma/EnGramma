import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

export const AddAlbum = () => {
  const [formData, setFormData] = useState({
    title: '',
    bandcamp: '',
    description: '',
    albumLink: '',
  });

  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assainir les données avant l'envoi
    const sanitizedData = {
      title: DOMPurify.sanitize(formData.title),
      bandcamp: formData.bandcamp,
      description: DOMPurify.sanitize(formData.description),
      albumLink: formData.albumLink,
    };

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/api/albums`, sanitizedData, {
        withCredentials: true,
      });

      console.log(response.data); // Vous pouvez traiter la réponse comme nécessaire

      // Réinitialiser le formulaire après avoir ajouté l'album avec succès
      setFormData({
        title: '',
        bandcamp: '',
        description: '',
        albumLink: '',
      });

      setFormStatus('success');

    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'album :', error.response ? error.response.data : error.message);
      setFormStatus('error');
    }
  };

  return (
    <div className="w-full shadow-md rounded-md p-2 md:p-3 bg-white md:m-3 ">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Ajouter un album</h2>
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
          <label className="block mb-4">
            <span className="text-gray-700">Titre de l'album:</span>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1" />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Intégrer lecteur Bandcamp:</span>
            <input type="text" name="bandcamp" value={formData.bandcamp} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1" />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Description de l'album:</span>
            <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1" />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Lien Bfan:</span>
            <input type="text" name="albumLink" value={formData.albumLink} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1" />
          </label>
          {formStatus === 'success' && <div className="text-green-500">Album ajouté avec succès!</div>}
          {formStatus === 'error' && <div className="text-red-500">Erreur lors de l'ajout de l'album.</div>}
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Ajouter l'album</button>
        </form>
    </div>
  );
};
