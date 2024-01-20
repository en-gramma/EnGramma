import React from 'react'
import { FaFacebook, FaInstagram, FaBandcamp, FaYoutube, FaDeezer, FaSpotify } from 'react-icons/fa';

export const Social = () => {
  return (
<div className="flex items-center ">
  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <FaFacebook className="social-media-icon text-3xl text-white mr-4 " />
  </a>
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <FaInstagram className="social-media-icon text-3xl text-white mr-4" />
  </a>
  <a href="https://www.bandcamp.com" target="_blank" rel="noopener noreferrer">
    <FaBandcamp className="social-media-icon text-3xl text-white mr-4" />
  </a>
  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
    <FaYoutube className="social-media-icon text-3xl text-white mr-4" />
  </a>
  <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">
    <FaSpotify className="social-media-icon text-3xl text-white mr-4" />
  </a>
  <a href="https://www.deezer.com" target="_blank" rel="noopener noreferrer">
    <FaDeezer className="social-media-icon text-3xl text-white mr-4" />
  </a>
</div>
  )
}
