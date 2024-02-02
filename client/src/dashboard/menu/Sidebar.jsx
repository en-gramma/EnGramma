import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { IoIosRadio } from "react-icons/io";
import { AiOutlineTeam } from 'react-icons/ai';
import { GoGear } from "react-icons/go";
import { BiPhotoAlbum } from "react-icons/bi";
import { BiAlbum } from "react-icons/bi";
import { GrArticle } from "react-icons/gr";
import { CiYoutube } from "react-icons/ci";
import { BsCalendar2Date } from "react-icons/bs";
import { CiLink } from "react-icons/ci";

export const Sidebar = ({ onSelectMenuItem }) => {

  //on récupère le  nom d'utilisateur qu'on affichera dans le dashboard
  const {currentUser} = useContext(AuthContext)

  return (
    <div className=" bg-white rounded-md p-5 z-0  shadow pt-5 h-full md:bgwhite md:rounded-sm">
      <div className=" border-b border-gray-300"></div>
      <h2 className="bg-gray-100 text-lg p-1 font-semibold shadow mb-2">
          {currentUser?.username} - {currentUser?.role === 'admin' ? 'Administrateur': 
          currentUser?.role === 'staff' ? 'Employé' : currentUser?.role}</h2>
            <span className=" cursor-pointer" onClick={() => onSelectMenuItem('changer-parametres')}>
          <div className="flex items-center mb-2 hover:font-semibold">
            <GoGear className="mr-2" />
            Paramètres
          </div>
        </span>
        {currentUser && currentUser.role === 'admin' && (
          <div className='mb-4'>
        <span className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-employe')}>
          <div className="flex items-center">
            <AiOutlineTeam className="mr-2" />
            Ajouter un membre
          </div>
        </span>
        </div>
        )}
      <div className=" mt-2 border-b border-gray-300"></div>
      <ul>
      <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Musique</div>
        <li className=" mb-4 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-album')}>
          <div className="flex items-center">
            <BiAlbum className="mr-2" />
            Editeur d'album
          </div>
        </li>
        <div className=" border-b border-gray-300"></div>
        <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Média</div>
      <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-image')}>
          <div className="flex items-center">
            <BiPhotoAlbum className="mr-2" />
           Editeur de photo
          </div>
        </li>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('editer-article')}>
          <div className="flex items-center">
            <GrArticle className="mr-2" />
            Editeur presse
          </div>
        </li>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-video')}>
          <div className="flex items-center">
            <CiYoutube className="mr-2" />
            Editeur de vidéo
          </div>
        </li>
        <li className="mb-4 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-radio')}>
          <div className="flex items-center">
            <IoIosRadio className="mr-2" />
            Editeur de radio
          </div>
        </li>
        <div className=" border-b border-gray-300"></div>
        <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Dates</div>
        <li className="mb-4 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-date')}>
          <div className="flex items-center">
            <BsCalendar2Date className="mr-2" />
            Editeur de date
          </div>
        </li>
        <div className="border-b border-gray-300"></div>
        <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Contact</div>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('update-lien')}>
          <div className="flex items-center">
            <CiLink className="mr-2" />
            Mise à jour des liens Pro
          </div>
        </li>

      </ul>
    </div>
  );
};

