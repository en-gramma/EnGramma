import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineCancel } from 'react-icons/md';


export const ServiceDel = () => {

  const [services, setServices] = useState([]);

  //récupération des services
  const fetchServices = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/services`, {
        withCredentials: true,
      });
      setServices(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  //effacer un service
  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce serrvice ?');
    if (confirmed) {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.delete(`${apiUrl}/api/services/${serviceId}`, {
        withCredentials: true,
      });
      // mise à jour de la liste des services après la suppression
      setServices(services.filter((service) => service.id !== serviceId));
    } catch (error) {
      console.error('Erreur lors de la suppression du service :', error);
    }
  }
  };

  //raffraichi la liste des services
  const handleRefresh = () => {
    fetchServices();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Effacer un service</h2>
      <p>Choisissez un service à effacer en cliquant dessus.</p> <br />
      <button
        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mb-4"
        onClick={handleRefresh}
      >
        Rafraîchir
      </button>
      <div className="mb-2 border-b border-gray-300"></div>
      <div className="flex flex-wrap">
        {services.map((service) => (
        <button
        key={service.id}
        onClick={() => handleDeleteService(service.id)}
        className="bg-transparent hover:bg-red-500 font-semibold hover:text-white py-1 px-2 border border-neutral-500 hover:border-transparent rounded mr-2 mb-2 flex items-center"
      >
        {service.service}
        <MdOutlineCancel className="ml-2" />
      </button>
        ))}
      </div>
      <div className="mb-2 border-b border-gray-300"></div>
    </div>
  );
};


