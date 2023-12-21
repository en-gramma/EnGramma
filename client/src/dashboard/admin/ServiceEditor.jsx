import React, { useState } from 'react';
import axios from 'axios';
import { ServiceDel } from './ServiceDel';
import DOMPurify from 'isomorphic-dompurify';


export const ServiceEditor = ({ onServiceAdded }) => {

  const [status, setStatus] = useState('');
  const [serviceData, setServiceData] = useState({
    service: '',
  });

  //mise à jour des entrées utilisateur
  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData({
      ...serviceData,
      [name]: value,
    });
  };

  //ajout d un service
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/api/services`, serviceData, {
        withCredentials: true,
      });
      if (response.status === 201) {
        setServiceData({
          service: DOMPurify.sanitize(''), 
        });
        setStatus('success');
      }
    } catch (error) {
      setStatus('error');
      console.error('Erreur lors de l\'ajout du service');
    }
  };

  return (
<>
<ServiceDel />
<div>
      <h2 className="text-xl font-bold mb-4 pt-5">Ajouter un service</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="service" className="block mb-2">Nom du service</label>
          <input
            type="text"
            id="service"
            name="service"
            value={serviceData.service}
            onChange={handleChange}

            className="border border-gray-400 w-full"/>
        </div>
        <div className="mb-4">
        {status === 'success' && 
            <p className="text-green-700 font-semibold mb-2">Le service a été ajoutée avec succes</p>
          }

          {status === 'error' &&
            <p className="text-red-700 font-semibold mb-2">Erreur lors de l'ajout du service</p>
          }
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mb-4">
            Ajouter le service
          </button>
        </div>
      </form>
    </div>

</>

  );
};

