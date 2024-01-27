import React from 'react'
import { FaFacebook, FaInstagram, FaBandcamp, FaYoutube, FaDeezer, FaSpotify } from 'react-icons/fa';

export const Social = () => {
  return (
    <div className="flex items-center ">
      <a href="https://www.facebook.com/engrammaofficial/" target="_blank" rel="noopener noreferrer">
        <FaFacebook className="social-media-icon text-3xl text-white mr-4 hover:text-orange2 transform hover:scale-125 transition-all" />
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
        <FaInstagram className="social-media-icon text-3xl text-white mr-4 hover:text-orange2 transform hover:scale-125 transition-all" />
      </a>
      <a href="https://engramma.bandcamp.com/" target="_blank" rel="noopener noreferrer">
        <FaBandcamp className="social-media-icon text-3xl text-white mr-4 hover:text-orange2 transform hover:scale-125 transition-all" />
      </a>
      <a href="https://www.youtube.com/@univergram9145" target="_blank" rel="noopener noreferrer">
        <FaYoutube className="social-media-icon text-3xl text-white mr-4 hover:text-orange2 transform hover:scale-125 transition-all" />
      </a>
      <a href="https://open.spotify.com/intl-fr/artist/7lMYiaRa7owPrOJD4cGN8m" target="_blank" rel="noopener noreferrer">
        <FaSpotify className="social-media-icon text-3xl text-white mr-4 hover:text-orange2 transform hover:scale-125 transition-all" />
      </a>
      <a href="https://www.deezer.com/fr/artist/236196681" target="_blank" rel="noopener noreferrer">
        <FaDeezer className="social-media-icon text-3xl text-white hover:text-orange2 transform hover:scale-125 transition-all" />
      </a>
    </div>
  )
}