import React, { useState, useEffect } from 'react';
import spaceimage from '../assets/spaceimage.jpg';



export const Media = () => {
  return (
    <div className=" relative overflow-hidden">
      <img src={spaceimage} alt="Music Background" className="object-cover w-full h-full bg-black bg-opacity-40 " />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center overflow-auto no-scrollbar">
      <h2 className="text-3xl font-bold mb-4 text-white font-custom text-center pt-[200px] md:pt-[100px]">PHOTOS</h2>
    </div>
    </div>
  )
}
