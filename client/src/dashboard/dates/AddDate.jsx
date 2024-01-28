import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

export const AddDate = () => {
  const [formData, setFormData] = useState({
    day: DOMPurify.sanitize (''),
    month: DOMPurify.sanitize (''),
    place: DOMPurify.sanitize (''),
    city: DOMPurify.sanitize (''),
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [dates, setDates] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/dates`, formData, 
      { withCredentials: true });
      setStatusMessage('success');
      fetchDates(); // Refresh the dates after adding a new one
    } catch (error) {
      setStatusMessage('error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette date ?')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.delete(`${apiUrl}/api/dates/${id}`, { withCredentials: true });
        fetchDates(); // Refresh the dates after deleting one
      } catch (error) {
        console.error('Error deleting date:', error);
      }
    }
  };

  const fetchDates = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/dates`);
      setDates(response.data);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);
  return (
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
  <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur de date</h2>
  <div className="mb-5 mt-2 border-b border-gray-300 "></div>
  <h3 className='font-semibold mb-3'>Ajouter une nouvelle date</h3>
      <form onSubmit={handleSubmit} className="">
        <input type="text" name="day" placeholder="Jour (numérique)" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <input type="text" name="month" placeholder="Mois (alphabétique)" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <input type="text" name="place" placeholder="Lieu" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <input type="text" name="city" placeholder="Ville" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <button type="submit" className="mb-4 py-1 px-2 bg-blue-500 text-white rounded">Ajouer une date</button>
      </form>
        {statusMessage === 'success' && <div className="text-green-500">La date a été ajouté avec succès!</div>}
        {statusMessage === 'error' && <div className="text-red-500">Erreur lors de l'ajout de la date</div>}

    <div className="mb-5 mt-2 border-b border-gray-300 "></div>
    <h3 className='font-semibold mb-3'>Effacer une date</h3>
    <div className="overflow-x-auto">
        <table className="table-auto w-full">
        <thead>
            <tr className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
            <th className="px-4 py-2">Jour</th>
            <th className="px-4 py-2">Mois</th>
            <th className="px-4 py-2">Lieu</th>
            <th className="px-4 py-2">Ville</th>
            <th className="px-4 py-2">Action</th>
            </tr>
        </thead>
        <tbody>
            {dates.slice().reverse().map((date) => (
            <tr key={date.id}>
                <td className="border px-4 py-2">{date.day}</td>
                <td className="border px-4 py-2">{date.month}</td>
                <td className="border px-4 py-2">{date.place}</td>
                <td className="border px-4 py-2">{date.city}</td>
                <td className="border px-4 py-2">
                <button onClick={() => handleDelete(date.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                    Effacer
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
        </div>
    </div>
  );
};

