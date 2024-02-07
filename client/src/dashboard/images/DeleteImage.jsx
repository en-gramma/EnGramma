import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosRefresh } from 'react-icons/io';

export function DeleteImage() {
  const [images, setImages] = useState([]);


    const fetchImages = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/images/`);
        setImages(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des images :', err.response ? err.response.data : err.message);
      }
    };

  useEffect(() => {
    fetchImages();
  }, []);

  const deleteImage = async (imageId) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?');
    if (confirmDelete) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.delete(`${apiUrl}/api/images/${imageId}`, {
          withCredentials: true,
        });
        setImages(images.filter((image) => image.id !== imageId));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image :', error.response ? error.response.data : error.message);
      }
    }
  };

  const refreshImages = async () => {
    fetchImages();
  };

  return (
  <>
    <div className="mb-5 mt-2 border-b border-gray-300"></div>
      <h2 className="text-lg font-bold  px-2 py-2 w-full">Effacer une photo</h2>
      <button
      className="mt-7 bg-blue-neutral hover:bg-blue-400 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow mb-7 mx-2 flex items-center"
      onClick={refreshImages}
    >
      <IoIosRefresh className="mr-1" /> Rafraîchir
    </button>
      <div className="grid grid-cols-1 -z-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(image => (
          <div key={image.id} className="relative">
            <img src={image.image} alt={image.title} className="w-full h-64 object-cover" />
            <button onClick={() => deleteImage(image.id)} className="absolute right-0 bottom-0 bg-red-500 text-white p-2">Effacer</button>
          </div>
        ))}
      </div>
  </>
  );
}