import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

export const AddVideo = () => {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState(''); // Ajouter un état pour le titre

  const [videos, setVideos] = useState([]);
  const [formStatus, setFormStatus] = useState(null);

  const fetchVideos = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/videos`);
      setVideos(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    try {
    const apiUrl = process.env.REACT_APP_API_URL;
      await axios.delete(`${apiUrl}/api/videos/${id}`, 
      { withCredentials: true });
      setVideos(videos.filter((video) => video.id !== id));

    } catch (err) {
      console.error(err);

    }
  };

  const extractVideo = (iframeHtml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(iframeHtml, 'text/html');
    const iframe = doc.querySelector('iframe');
    if (iframe) {
      const sanitizedSrc = DOMPurify.sanitize(iframe.getAttribute('src'), { ADD_ATTR: ['allowfullscreen', 'scrolling'] });
      return sanitizedSrc;
    }
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const frenchTextRegex = /^[a-zA-Z0-9àâäéèêëïîôöùûüçÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ' -!"?]+$/;
      if (!frenchTextRegex.test(title)) {
        alert('Erreur : Le champs titre contien des caractères non valides');
        return;
      }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/videos`, { link, title }, 
      {withCredentials: true});
      setLink('');
      setTitle('');
      setFormStatus('success');
      fetchVideos(); // Rafraîchir les vidéos
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };
 

  return (
    <>
    <div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Editeur de vidéo</h2>
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
      <h2 className="text-lg font-bold mb-4  px-2 py-2 w-full">Ajouter une vidéo</h2>
    <form onSubmit={handleSubmit} className='w-full max-w-lg md:mx-2'>
    <label className='block mb-4'>
    <span className="text-gray-700">Titre de la vidéo</span>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
      required className='border p-2 w-full'
      placeholder='' />
      </label>
        <label className='block mb-4'>
        <span className="text-gray-700">Lien au format iframe, sur Youtube, Partager - Intégrer</span>
      <input type="text" value={link} onChange={(e) => setLink(e.target.value)}  
      required className='border p-2 w-full' />
      </label>
        {formStatus === 'success' && <div className="text-green-500 mb-2">La vidéo a été ajoutée avec succès!</div>}
        {formStatus === 'error' && <div className="text-red-500 mb-2">Erreur lors de l'ajout de la vidéo</div>}
      <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
    </form>

    <div className="mb-5 mt-9 border-b border-gray-300"></div>
    <h2 className="text-lg font-bold mb-4 px-2 py-2 w-full">Effacer une vidéo</h2>
 
    <div className='grid md:grid-cols-3 gap-4 mt-4 md:mx-2'>
    {videos.map((video) => {
    const videoUrl = extractVideo(video.link);
    return (
        <div key={video.id}>
          <p className='font-bold my-2'>{video.title}</p>
        <iframe
            className=' lg:mx-0  rounded-lg w-full h-auto'
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
        <button onClick={() => handleDelete(video.id)} className='bg-red-500 py-1 px-2 rounded text-white mt-2 mb-2 w-full'>Supprimer</button>

       </div>
    );
    })}
    </div>
    </div>
    </>
  );
};


