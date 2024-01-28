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
    <div className="w-full shadow-md rounded-md p-2 md:p-3 bg-white md:m-3 ">
      <h2 className="text-xl font-bold px-2 py-2 w-full">Mise à jour des liens Pro</h2>
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
      {links.map((link, index) => (
        <div key={index}>
          <p className="text-gray-500">Lien du Dossier de presse actuel: <span className='text-blue-600'>{link.dossier}</span></p>
          <p className="text-gray-500">Lien de la Fiche technique actuel: <span className='text-blue-600'>{link.fiche}</span></p>
        </div>
      ))}
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-semibold">Lien du dossier de presse:</span>
          <input
            type="text"
            placeholder='Laisser ce champs vide pour ne pas changer'
            value={dossier}
            onChange={(e) => setDossier(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 border shadow-sm p-1"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-semibold">Lien de la fiche technique:</span>
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
        <button type="submit" className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 =">Mettre à jour</button>
      </form>
    </div>
  );
};