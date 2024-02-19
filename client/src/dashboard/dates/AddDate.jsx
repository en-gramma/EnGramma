import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

export const AddDate = () => {
  const [formData, setFormData] = useState({
    day: DOMPurify.sanitize (''),
    month: DOMPurify.sanitize (''),
    monthEn: DOMPurify.sanitize (''),
    place: DOMPurify.sanitize (''),
    city: DOMPurify.sanitize (''),
    year: DOMPurify.sanitize ('')
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [dates, setDates] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const sanitzedFormData = {
      day: DOMPurify.sanitize(formData.day),
      month: DOMPurify.sanitize(formData.month),
      monthEn: DOMPurify.sanitize(formData.monthEn),
      place: DOMPurify.sanitize(formData.place),
      city: DOMPurify.sanitize(formData.city),
      year: DOMPurify.sanitize(formData.year)
    };
  
    // Input validation
    const dayRegex = /^\d+$/;
    const wordRegex = /^[\w\W\s]*$/;
  
    if (!dayRegex.test(sanitzedFormData.day) || !wordRegex.test(sanitzedFormData.month) || 
        !wordRegex.test(sanitzedFormData.place) || !wordRegex.test(sanitzedFormData.city)
        || !wordRegex.test(sanitzedFormData.monthEn) || !dayRegex.test(sanitzedFormData.year)) {
      alert('Caractère non valide dans un des champs');
      return;
    }
  
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/dates`, sanitzedFormData,
      { withCredentials: true });
      setFormData({
        day: DOMPurify.sanitize (''),
        month: DOMPurify.sanitize (''),
        monthEn: DOMPurify.sanitize (''),
        place: DOMPurify.sanitize (''),
        city: DOMPurify.sanitize (''),
        year: DOMPurify.sanitize ('')
      });
      setStatusMessage('success');
      fetchDates(); 
  
    } catch (error) {
      setStatusMessage('error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette date ?')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.delete(`${apiUrl}/api/dates/${id}`, { withCredentials: true });
        fetchDates(); 
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
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
      <h2 className="text-lg font-bold mb-4  px-2 py-2 w-full">Ajouter une nouvelle date</h2>
      <form onSubmit={handleSubmit} className="">
        <input required value={formData.day}  type="text" name="day" placeholder="Jour (numérique)" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <input required value={formData.month} type="text" name="month" placeholder="Mois (alphabétique)" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <input required value={formData.monthEn} type="text" name="monthEn" placeholder="Mois (en anglais)" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <input required value={formData.year} type="text" name="year" placeholder="Année" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <input required value={formData.place} type="text" name="place" placeholder="Lieu" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />
        <input required value={formData.city} type="text" name="city" placeholder="Ville" onChange={handleChange} className="mb-4 rounded mr-1 p-2 border border-gray-400" />

        <button type="submit" className="mb-4 p-2 bg-blue-500 text-white rounded">Ajouter une date</button>
      </form>
        {statusMessage === 'success' && <div className="text-green-500">La date a été ajoutée avec succès!</div>}
        {statusMessage === 'error' && <div className="text-red-500">Erreur lors de l'ajout de la date</div>}

    <div className="mb-5 mt-2 border-b border-gray-300 "></div>
    <h3 className='font-semibold mb-3'>Effacer une date</h3>
    <div className="overflow-x-auto">
        <table className="table-auto w-full">
        <thead>
            <tr className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
            <th className="px-4 py-2">Année</th>
            <th className="px-4 py-2">Jour</th>
            <th className="px-4 py-2">Mois</th>
            <th className="px-4 py-2">Mois (en anglais)</th>
            <th className="px-4 py-2">Lieu</th>
            <th className="px-4 py-2">Ville</th>
            <th className="px-4 py-2">Action</th>
            </tr>
        </thead>
        <tbody>
            {dates.slice().reverse().map((date) => (
            <tr key={date.id}>
                <td className="border px-4 py-2">{date.year}</td>
                <td className="border px-4 py-2">{date.day}</td>
                <td className="border px-4 py-2">{date.month}</td>
                <td className="border px-4 py-2">{date.monthEn}</td>
                <td className="border px-4 py-2">{date.place}</td>
                <td className="border px-4 py-2">{date.city}</td>
                <td className="border px-4 py-2">
                <button onClick={() => handleDelete(date.id)} className="bg-red-500 hover:bg-red-700 text-white  py-1 px-2 rounded">
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

