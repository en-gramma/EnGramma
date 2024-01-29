import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const AddVideo = () => {
  const [link, setLink] = useState('');
  const [videos, setVideos] = useState([]);
  const [formStatus, setFormStatus] = useState(null);


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
    const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/api/videos`, { link }, 
      {withCredentials: true});
      setLink('');
        setFormStatus('success');
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/videos`);
        setVideos(response.data);
      } catch (err) {
        console.error(err);
      }
    };

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
<div className="w-full shadow-md rounded-md p-2 md:p-3 bg-white md:m-3 ">
      <h2 className="text-xl font-bold  px-2 py-2 w-full">Ajouter une vidéo</h2>
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
    <form onSubmit={handleSubmit}>
        <label className='block mb-4'>
      <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Lien de la vidéo" 
      required className='border p-2 w-full' />
      </label>
        {formStatus === 'success' && <div className="text-green-500 mb-2">La vidéo a été ajoutée avec succès!</div>}
        {formStatus === 'error' && <div className="text-red-500 mb-2">Erreur lors de l'ajout de la vidéo</div>}
      <button className="bg-blue-500 text-white p-2 rounded" type="submit">Ajouter</button>
    </form>
    <div className="mb-5 mt-2 border-b border-gray-300"></div>
    <h2 className="text-lg font-bold  px-2 py-2 w-full">Effacer une vidéo</h2>
      <div className="mb-5 mt-2 border-b border-gray-300"></div>
    <div className='mt-4'>
    {videos.map((video) => {
    const videoUrl = extractBandcampLink(video.link);
    return (
        <div key={video.id}>
        <iframe
            className='mx-auto lg:mx-0  rounded-lg'
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
        <button onClick={() => handleDelete(video.id)} className='bg-red-500 py-1 px-2 rounded text-white  mt-2 mb-2'>Supprimer</button>
        <div className="mb-5 mt-2 border-b border-gray-300"></div>
       </div>
    );
    })}
    </div>
    </div>
    </>
  );
};


