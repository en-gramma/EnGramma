import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import spaceimage from '../assets/spaceimage.jpg';
import {Loader }from './Loader';
import 'photoswipe/style.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/images/`);
        setImages(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des images ');

      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: '#my-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, [images]);

  const divStyle = {
    backgroundImage: `url(${spaceimage})`,
    // backgroundAttachment: 'fixed',
  };

  return (

<div style={divStyle} className="h-screen-110 py-9 bg-no-repeat bg-center bg-cover shadow-xl flex bg-black bg-opacity-40 items-center flex-col">

    <div className="text-4xl   text-white font-custom text-center pt-7 mb-9">PHOTOS</div>
    {isLoading ? (
      <div className='flex justify-center items-center h-full w-full'>
        <Loader />
      </div>
    ) : (
<div className="overflow-auto  scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thin scrollbar-corner-20 max-h-[100vh]  md:mx-[200px]">
  <div id="my-gallery" className="grid md:grid-cols-3 md:gap-4 grid-cols-1 gap-2 w-full ">
    {images.reverse().map((image, index) => (
      <div key={image.id} className="relative w-full">
        <a href={image.image} data-pswp-width={image.width} data-pswp-height={image.height}>
          <img src={image.image} alt={image.title} className="w-full h-full object-cover rounded-lg cursor-pointer" />
        </a>
        <p className="absolute bottom-0 right-0 text-gray-300 px-2 py-1 text-xxs bg-black bg-opacity-10">&copy; {image.author}</p>
      </div>
    ))}
  </div>
</div>
    )}
  </div>

    
  );
};

export default ImageGallery;