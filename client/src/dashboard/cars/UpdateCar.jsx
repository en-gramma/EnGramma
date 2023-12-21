import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSafetyCertificate, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { EditCarModal } from './EditCarModal';
import DOMPurify from 'isomorphic-dompurify'


export const UpdateCar = () => {

  const [cars, setCars] = useState([]);
  const [editCar, setEditCar] = useState(null);

  // Récupération des données 
  useEffect(() => {
    async function fetchCars() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/cars`);
        setCars(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    }
    fetchCars();
  }, []);

  // Fonction pour supprimer une voiture
  const deleteCar = async (carId) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?');
    if (confirmDelete) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.delete(`${apiUrl}/api/cars/${carId}`, {
          withCredentials: true,
        });
        setCars(cars.filter((car) => car.id !== carId));
      } catch (error) {
        console.error('Erreur lors de la suppression de la voiture');
      }
    }
  };

  // fonction qui active la modal
  const openEditModal = (car) => {
    setEditCar(car);
  };

  // fonction pour mettre à jour la voiture
  const updateCar = async (car) => {
    const purifiedCar = {
      ...car, 
      title: DOMPurify.sanitize(car.title),
      image: DOMPurify.sanitize(car.image),
      year: DOMPurify.sanitize(car.year),
      price: DOMPurify.sanitize(car.price),
      km: DOMPurify.sanitize(car.km),
      fuel: DOMPurify.sanitize(car.fuel),
      gearbox: DOMPurify.sanitize(car.gearbox),
      warrant: DOMPurify.sanitize(car.warrant),
    }
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.put(`${apiUrl}/api/cars/${car.id}`, purifiedCar, {
        withCredentials: true,
      });

      // mise à jour des voiture dans le state
      const updatedCars = cars.map((c) => (c.id === car.id ? car : c));
      setCars(updatedCars);

      setEditCar(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la voiture :', error);
    }
  };

  return (
    <>
    <h1 className="font-bold text-lg mb-4 mx-auto flex">Modifier ou supprimer une voiture</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
    
      {cars.map((car) => (
        
        <div
          key={car.id}
          className="bg-stone-100 shadow-md rounded-md p-4 hover:border-red-500 border border-transparent cursor-pointer">

          <div className="flex justify-between items-center">
            <button
              onClick={() => openEditModal(car)}
              className="text-blue-600 hover:text-blue-800 flex items-center">
            <AiOutlineEdit className="mr-1" />
            Editer
          </button>
          <button
            onClick={() => deleteCar(car.id)}
            className="text-red-600 hover:text-red-800 flex items-center">
            <AiOutlineDelete className="mr-1" />
            Supprimer
          </button>

        </div>
        <div className="mb-4 mt-2 border-b border-gray-300"></div>
        <div className="w-full h-40 overflow-hidden">
        <img src={`${car?.image.replace('http://', 'https://')}`} alt={car.title} className="w-full h-full object-cover" />
      </div>

          <h2 className="text-lg font-semibold mt-2">{car.title}</h2>
          <div className="flex justify-between mt-1">
            <p className="text-sm text-gray-600">
              {car.year} |<span style={{ marginRight: '5px' }}></span>
              {car.km} km |<span style={{ marginRight: '5px' }}></span>
              {car.gearbox} |<span style={{ marginRight: '5px' }}></span>
              {car.fuel}
            </p>
          </div>
          <div className="mb-2 mt-2 border-b border-gray-300"></div>
          <div className="flex justify-between items-center">
            <button
              className="flex items-center border border-red-600 text-red-600 text-sm rounded-md px-1  focus:outline-none" disabled>
              <AiOutlineSafetyCertificate className="mr-1" /> Garantie {car.warrant} mois
            </button>
          </div>
          <div className="mb-4 mt-2 border-b border-gray-300"></div>
          <p className="text-lg font-semibold  mt-2">{car.price} €</p>
        </div>

      ))}
      {editCar && (
        <EditCarModal
          car={editCar}
          isOpen={Boolean(editCar)}
          onClose={() => setEditCar(null)}
          onUpdate={updateCar}/>
      )}
    </div>
    </>
  );
};

