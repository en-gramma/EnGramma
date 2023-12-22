import React from 'react'
import spaceImage from '../assets/spaceimage.jpg';
import logo from '../assets/logo.png';
export const Home = () => {
  const divStyle = {
    backgroundImage: `url(${spaceImage})`,
    backgroundAttachment: 'fixed',
  };

  const logoStyle = {
    background: `url(${logo}) center center / contain no-repeat`,
    opacity: 0.05,
  };

  return (
    <div style={divStyle} className="p-5 bg-no-repeat bg-center bg-cover h-screen shadow-xl flex bg-black bg-opacity-40 justify-center items-center">
      <div style={logoStyle} className="absolute inset-0 scale-90"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center ">
        <h1 className="text-5xl md:text-7xl">
          <span className="font-custom text-Engramma dropshadow-xl">EN GRAMMA</span>
        </h1>
      </div>
    </div>
  );
};
