import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosRefresh } from 'react-icons/io';

export function DeleteAlbum() {
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('');


    async function fetchAlbums() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/albums`);
        setAlbums(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    }
  
  useEffect(() => {
    fetchAlbums();
  }, []);

  const deleteAlbum= async (albumId) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet album ?');
    if (confirmDelete) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.delete(`${apiUrl}/api/albums/${albumId}`, {
          withCredentials: true,
        });
        setAlbums(albums.filter((album) => album.id !== albumId));
        setStatus('success');
      } catch (error) {
        console.error('Erreur lors de la suppression de la voiture');
        setStatus('error');
      }
    }
  };

  const extractBandcampLink = (iframeHtml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(iframeHtml, 'text/html');
    const iframe = doc.querySelector('iframe');
    if (iframe) {
      return iframe.getAttribute('src');
    }
    return null;
  };

  const refreshAlbums = () => {
    fetchAlbums();
  }

  return (
 <>
        <h2 className="text-xl font-bold  px-2  w-full">Effacer un album</h2>
        <button
      className="mt-7 bg-blue-neutral hover:bg-blue-400 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow mb-7 mx-2 flex items-center"
      onClick={refreshAlbums}
    >
      <IoIosRefresh className="mr-1" /> Rafraîchir
    </button>
    <div className='mb-9'></div>

      {status && <p>{status}</p>}
      {albums.slice().reverse().map((album) => (
        <React.Fragment key={album.id}>
              <div  className="mb-3 md:ml-3 text-white flex flex-col lg:flex-row bg-neutral-800 p-1 md:p-5 rounded shadow
              ">
                <div className="lg:mb-0 mb-4 ">
                <div className='flex items-center mb-4'>
                  <h1 className='text-xl font-bold uppercase  text-center lg:text-left mr-5'>{album.title}</h1>
                  <button onClick={() => deleteAlbum(album.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold  px-4 rounded mx-1 text-center animate-fade-up shadow-md">Supprimer</button>
                </div>
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
                  <p className='text-sm mb-4 text-justify mx-4 bg-black bg-opacity-50 md:bg-transparent lg:text-left sm:w-[400px] md:w-[500px] lg:mt-[200px] animate-fade-left'>{album.description}</p>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 md:mt-9">
                    <a
                      href={album.albumLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange2 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-2 lg:mb-0 mx-3 text-center animate-fade-up shadow-md"
                    >
                      Trouver l'album
                    </a>
                    <a href="/media" className='text-orange2 underline mt-1 mx-3 text-center animate-fade-up animate-delay-500 '>voir les avis presse</a>
                  </div>
                </div>
              </div>
              </React.Fragment>
            ))}
      </>
  );
}

