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

  const divStyle = {
    backgroundImage: `url(${spaceimage})`,
    backgroundAttachment: 'fixed',
  };

  return (
    <div style={divStyle} className="h-screen-110  bg-no-repeat bg-center bg-cover shadow-xl flex bg-black bg-opacity-40 items-center">
      <div className=" absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center  overflow-auto no-scrollbar">
        <div className="text-4xl font-bold text-white font-custom text-center mb-9  pt-[100px] ">PHOTOS</div>
        <div className="overflow-auto no-scrollbar max-h-[100vh] ">
          <div id="my-gallery" className="grid md:grid-cols-3 md:gap-4 grid-cols-1 mx-2 gap-2 md:mx-[200px] ">
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