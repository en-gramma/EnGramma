import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

export const AddCar = () => {
  const [formData, setFormData] = useState({
    title: '',
    bandcamp: '',
    description: '',
    albumLink: '',
  });

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

    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'album :', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>Ajouter un album</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Titre:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <br />
        <label>
          Bandcamp:
          <input type="text" name="bandcamp" value={formData.bandcamp} onChange={handleChange} />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        <br />
        <label>
          Lien de l'album:
          <input type="text" name="albumLink" value={formData.albumLink} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Ajouter l'album</button>
      </form>
    </div>
  );
};
