import React from 'react'
import { Link } from 'react-router-dom' // Import Link
import spaceImage from '../assets/spaceimage.jpg';
import logo from '../assets/logo.png';
import { Social } from '../components/Social';

export const Footer = () => {
  return (
    <>
      <div>
        <div className="flex-grow border-t border-white mr-1"></div>
        <footer className="relative text-white bg-black bg-opacity-40" style={{ backgroundImage: `url(${spaceImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <div className="absolute inset-0" ></div>
          <div className="relative flex items-center justify-between px-4 h-[150px]">
            {/* Left Section */}
            <div className="space-x-4 hidden my-2 md:flex flex-col items-center">
              {/* Logo */}
              <img src={logo} alt="Your Logo" className="h-[75px]  ml-2 mb-4" />
              {/* Copyright */}
              <p>&copy; En Gramma réalisé par 
                <a href="mailto:kiato.dv@gmail.com"> Kiato</a></p>
            </div>

            {/* Center Section */}
            <div className=" absolute inset-0 flex flex-col items-center justify-center">
              {/* Contact Text */}
              <p className="font-custom dropshadow-xl text-2xl mt-2">CONTACT</p>
              {/* Email */}
              <p className='text-orange2 my-4'>univergram.asso@gmail.com</p>
                {/* Social Media Icons */}
                <Social />
                <p className='text-xs md:hidden mt-2'>&copy; En Gramma</p>
            </div>

            {/* Right Section */}
            <div className="right-7 bottom-5 absolute">
              {/* Privacy Policy Link */}
              <Link to="/privacy" className="underline text-orange2">Politique de confidentialité</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}