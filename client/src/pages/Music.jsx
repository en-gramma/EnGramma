import React from 'react';
import scene from '../assets/scene.jpg';  // Assurez-vous de remplacer le chemin par celui de votre image

export const Music = () => {
  return (
    <div className="h-screen">
      <img src={scene} alt="Music Background" className="object-cover w-full h-full" />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        {/* Votre contenu musical peut être ajouté ici */}
        <h1 className="text-white text-4xl font-bold">Music Content</h1>
      </div>
    </div>
  );
};
