import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function DeleteAlbum() {
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/albums`);
        setAlbums(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    }
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

  return (
 <>
        <h2 className="text-xl font-bold  px-2 py-5 w-full">Effacer un album</h2>

      {status && <p>{status}</p>}
      {albums.map(album => (
        
        <div key={album.id} className='mb-3  md:border md:border-gray-300 md:w-[375px] p-2 rounded shadow-md '>
            <h2 className='mb-2 font-semibold'>{album.title}</h2>
            <button className='bg-red-500 py-1 px-2 rounded text-white w-full mt-2 mb-2' onClick={() => deleteAlbum(album.id)}>Effacer l'album</button>
                              <iframe
                    title={`Bandcamp ${album.title}`}
                    style={{ border: 10, width: '350px', height: '470px' }}
                    className='mx-auto lg:mx-0  rounded-lg'
                    src={extractBandcampLink(album.bandcamp)}
                    seamless
                  >
                    <a href={album.bandcamp}>{album.title} sur Bandcamp</a>
                  </iframe>
          
          
        </div>
      ))}
      </>
  );
}

