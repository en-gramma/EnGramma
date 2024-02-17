import React from 'react'
import { Link } from 'react-router-dom' // Import Link
import spaceImage from '../assets/spaceimage.jpg';
import logo from '../assets/logo.png';
import Social from '../components/Social';

export const Footer = () => {
  return (
    <>
      <div>
        <div className="flex-grow border-t border-white mr-1"></div>
        <footer className="relative text-white bg-black bg-opacity-40" style={{ backgroundImage: `url(${spaceImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <div className="absolute inset-0" ></div>
          <div className="relative flex items-center justify-between px-4 h-[150px]">
            <div className="space-x-4 hidden my-2 md:flex flex-col items-center">
              <img src={logo} alt="En Gramma" className="h-[75px]  ml-2 mb-4" />
              <p>&copy; En Gramma réalisé par 
                <a href="mailto:kiato.dv@gmail.com"> Kiato</a></p>
            </div>


            <div className=" absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-custom dropshadow-xl text-2xl mt-2">CONTACT</p>
              <p className='text-orange2 my-4'>univergram.asso@gmail.com</p>
                <Social />
                <div className='flex items-center'>
                <p className='text-xs md:hidden mt-2'>&copy; En Gramma</p>
                <Link to="/privacy" className=" ml-3 underline text-orange2 text-xs md:hidden mt-2">Politique de confidentialité</Link>
                </div>
            </div>

            <div className="right-7 bottom-5 absolute">
              <Link to="/privacy" className="underline text-orange2 hidden md:block">Politique de confidentialité</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}