import React, { useEffect, useState } from 'react';
import scene from '../assets/scene.jpg';
import axios from 'axios';
import '../index.css';

export const Music = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // récupération des albums
    async function fetchAlbums() {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/albums`);
        setAlbums(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des albums :', error);
      }
    }

    fetchAlbums();
  }, []);

  // Fonction pour extraire le lien Bandcamp de l'iframe
  const extractBandcampLink = (iframeHtml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(iframeHtml, 'text/html');
    const iframe = doc.querySelector('iframe');
    if (iframe) {
      return iframe.getAttribute('src');
    }
    return null;
  };


  return (
    <div className="h-screen relative">
      <img src={scene} alt="Music Background" className="object-cover w-full h-full" />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}></div>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
        {/* Votre contenu musical peut être ajouté ici */}
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="flex flex-col items-center text-lg text-white z-10 mt-[75px] overflow-y-auto  max-h-[80vh] no-scrollbar">
            {albums.map((album) => (
              <div key={album.id} className="mb-4 flex flex-col lg:flex-row">
                <div className="lg:mb-0 mb-4 ">
                  <h1 className='text-3xl font-bold uppercase mb-4 text-center lg:text-left'>{album.title}</h1>
                  {/* Utilisez la fonction pour extraire le lien Bandcamp */}
                  <iframe
                    title={`Bandcamp ${album.title}`}
                    style={{ border: 10, width: '350px', height: '470px' }}
                    className='mx-auto lg:mx-0 shadow-xl rounded-lg'
                    src={extractBandcampLink(album.bandcamp)}
                    seamless
                  >
                    <a href={album.bandcamp}>{album.title} sur Bandcamp</a>
                  </iframe>
                </div>
                <div className='lg:flex lg:flex-col lg:items-center lg:ml-8'>
                  <p className='text-sm mb-4 text-justify mx-4 bg-black bg-opacity-50 md:bg-transparent lg:text-left max-w-[600px] md:mt-[200px] animate-fade-left'>{album.description}</p>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                    <a
                      href={album.albumLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-2 lg:mb-0 mx-3 text-center animate-fade-up shadow-md"
                    >
                      Trouver l'album
                    </a>
                    <a href="/media" className='text-orange-600 underline mt-1 mx-3 text-center animate-fade-up'>voir les avis presse</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

};
