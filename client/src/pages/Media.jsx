import React from 'react';
import spaceimage from '../assets/spaceimage.jpg';
import ImageGallery from '../components/ImageGallery';

export const Media = () => {
  return (
    <div className="h-screen relative overflow-hidden">
      <img src={spaceimage} alt="Music Background" className="object-cover w-full h-full bg-black bg-opacity-40 " />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center overflow-auto no-scrollbar">
      <h2 className="text-3xl font-bold mb-4 text-white font-custom text-center pt-[500px] md:pt-0">PHOTOS</h2>

      <ImageGallery />
    </div>
    </div>
  )
}
