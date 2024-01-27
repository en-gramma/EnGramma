import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/images/`);
        setImages(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des images :', err.response ? err.response.data : err.message);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const options = {
      gallery: '#my-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe')
    };
    const lightbox = new PhotoSwipeLightbox(options);
    lightbox.init();
  }, [images]);

  return (
    <div id="my-gallery" className="grid md:grid-cols-3 md:gap-4 grid-cols-1 mx-2 gap-2 max-w-[1000px]">
      {images.sort((a, b) => b.height + a.height).map((image, index) => {
        return (
          <div key={image.id} className="relative ">
            <a href={image.image} data-pswp-width={image.width} data-pswp-height={image.height}>
              <img src={image.image} alt={image.title} className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer" />
            </a>
            <p className="absolute bottom-0 right-0 text-gray-300 px-2 py-1 text-xxs bg-black bg-opacity-10">&copy; {image.author}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ImageGallery;