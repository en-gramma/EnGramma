import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import spaceimage from '../assets/spaceimage.jpg';
import 'photoswipe/style.css';

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

  return (
    <div className="h-screen md:h-screen-110 relative overflow-hidden">
      <img src={spaceimage} alt="Music Background" className="object-cover w-full h-full bg-black bg-opacity-40  " />
      <div className=" absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center overflow-auto no-scrollbar">
        <div className="text-2xl font-bold mb-4 text-white font-custom text-center  pt-[100px] ">PHOTOS</div>
        <div className="overflow-auto no-scrollbar max-h-[100vh] mb-9 ">
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
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;