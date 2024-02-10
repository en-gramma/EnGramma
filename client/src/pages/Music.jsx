import React, { useEffect, useState } from 'react';
import scene from '../assets/scene.jpg';
import axios from 'axios';
import {Loader} from '../components/Loader';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'isomorphic-dompurify';

import '../index.css';

export const Music = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t,i18n } = useTranslation();

  useEffect(() => {
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
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-auto ">
        {loading ? (
          <Loader />
        ) : (
          <div className={`flex flex-col items-center text-md text-white z-10 mt-[75px] ${albums.length >= 2 ? 'overflow-y-auto' : ''} max-h-[80vh] no-scrollbar`}>
            {albums.slice().reverse().map((album) => (
              <div key={album.id} className="mb-[100px] flex flex-col lg:flex-row align-items-start">
                <div className="lg:mb-0 mb-4 ">
                  <h1 className='text-3xl font-bold uppercase mb-4 text-center lg:text-left'>{t(album.title)}</h1>
                  <iframe
                    title={`Bandcamp ${t(album.title)}`}
                    style={{ border: 10, width: '350px', height: '470px' }}
                    className='mx-auto lg:mx-0 shadow-xl rounded-lg'
                    src={extractBandcampLink(album.bandcamp)}
                    seamless
                  >
                    <a href={album.bandcamp}>{t(album.title)} sur Bandcamp</a>
                  </iframe>
                </div>
                <div className='lg:flex lg:flex-col lg:items-center lg:ml-8 mb-7'>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18n.language === 'en' ? album.descriptionEn : album.description).replace(/\n/g, '<br />')) }} 
                className='text-lg text-justify mx-4 bg-black bg-opacity-50 md:bg-transparent lg:text-left sm:w-[400px] md:w-[600px] md:mt-[50px]  animate-fade-left'/>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 ">
                    <a
                      href={album.albumLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange2 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-2 lg:mb-0 mx-3 text-center animate-fade-up shadow-md"
                    >
                      {t('music.button')}
                    </a>
                    <a href="/media" className='text-orange2 underline mt-1 mx-3 text-center animate-fade-up animate-delay-500 '>{t('music.press')}</a>
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