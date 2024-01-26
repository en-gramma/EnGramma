import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';

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

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid flex -mx-2"
      columnClassName="my-masonry-grid_column px-2"
    >
      {images.map((image) => (
        <div key={image.id} className="w-80 p-2 relative mb-4">
          <img src={image.image} alt={image.title} className="w-full h-auto rounded shadow-lg" />
          <p className="absolute bottom-2 right-2 text-white px-2 py-1 text-xs bg-black bg-opacity-20">&copy; {image.author}</p>
        </div>
      ))}
    </Masonry>
  );
};

export default ImageGallery;