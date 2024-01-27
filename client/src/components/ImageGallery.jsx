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
    // Use the Masonry component to create the masonry layout
    <Masonry
      // Specify the number of columns at different viewport widths
      breakpointCols={breakpointColumnsObj}
      // Apply styles to the grid
      className="my-masonry-grid flex -mx-2"
      // Apply styles to the columns
      columnClassName="my-masonry-grid_column px-2"
    >
      {images.sort((a, b) => b.height - a.height).map((image) => {
        const isLandscape = image.width > image.height;
        return (
          // Create a div for each image
          // The className is dynamically set based on whether the image is in landscape or portrait orientation
          <div key={image.id} className={`md:w-[400px] p-2 relative mb-4 ${isLandscape ? 'h-64 landscape' : 'h-133 portrait'}`}>
 
            <img src={image.image} alt={image.title} className="w-full h-full object-cover rounded shadow-lg" />

            <p className="absolute bottom-2 right-2 text-gray-300 px-2 py-1 text-xs bg-black bg-opacity-20">&copy; {image.author}</p>
          </div>
        );
      })}
    </Masonry>
  );
};

export default ImageGallery;