import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const UpdateLinks = () => {
  const [dossier, setDossier] = useState('');
  const [fiche, setFiche] = useState('');
  const [links, setLinks] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });
  
  const fetchLinks = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/links`, { withCredentials: true });
      setLinks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

const handleSubmit = async (event) => {
    event.preventDefault();

      // URL validation regex
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  // Validate the inputs
  if ((dossier !== '' && !urlRegex.test(dossier)) || (fiche !== '' && !urlRegex.test(fiche))) {
    alert('Veuillez entrer un lien valide. Exemple: https://www.example.com.');
    return;
  }
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const updatedDossier = dossier !== '' ? dossier : links[0].dossier;
      const updatedFiche = fiche !== '' ? fiche : links[0].fiche;
      const response = await axios.put(`${apiUrl}/api/links/1`, 
      { dossier: updatedDossier, fiche: updatedFiche }, 
      { withCredentials: true });
      setStatusMessage({ text: 'Lien mis à jour avec succès!', isError: false });
      fetchLinks();
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setStatusMessage({ text: 'Erreur lors de la mise à jour du/des lien(s).', isError: true });
    }
  };
  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Mise à jour des liens pro.</h2>
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
      <h2 className="text-lg font-bold mb-4  px-2 py-2 w-full">Modifier le lien</h2>
      {links.map((link, index) => (
        <div key={index} className='md:mx-2'>
          <p className="text-gray-500">Lien du Dossier de presse actuel: <span className='text-blue-600'>{link.dossier}</span></p>
          <p className="text-gray-500">Lien de la Fiche technique actuel: <span className='text-blue-600'>{link.fiche}</span></p>
        </div>
      ))}
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
      <form onSubmit={handleSubmit} className='w-full max-w-lg  md:mx-2'>
        <label className="block">
          <span className="text-gray-700 ">Lien du dossier de presse:</span>
          <input
            type="text"
            placeholder='Laisser ce champs vide pour ne pas changer'
            value={dossier}
            onChange={(e) => setDossier(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1 mb-2"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 ">Lien de la fiche technique:</span>
          <input
            type="text"
            placeholder='Laisser ce champs vide pour ne pas changer'
            value={fiche}
            onChange={(e) => setFiche(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1"
          />
        </label>
        {statusMessage.text && (
        <p className={`text-${statusMessage.isError ? 'red' : 'green'}-500`}>{statusMessage.text}</p>
      )}
        <button type="submit" className="w-full py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 =">Mettre à jour</button>
      </form>
    </div>
  );
};
