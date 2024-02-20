import React from 'react';
import { useContext, useState } from 'react';
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
import { IoHomeOutline } from "react-icons/io5";

export const Sidebar = ({ onSelectMenuItem }) => {

  //on récupère le  nom d'utilisateur qu'on affichera dans le dashboard
  const {currentUser} = useContext(AuthContext);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuItemClick = (menuItem) => {
    window.scrollTo(0, 0);
    onSelectMenuItem(menuItem);
    setSelectedMenu(menuItem);
  };

  return (
    <div className=" p-5 z-0  shadow pt-5">
      <div className=" border-b border-gray-300"></div>
      <h2 className="bg-gray-100 text-md p-1 font-semibold shadow mb-2">
          {currentUser?.username} - {currentUser?.role === 'admin' ? 'Administrateur': 
          currentUser?.role === 'staff' ? 'Employé' : currentUser?.role}</h2>
            <span className={`mb-2 cursor-pointer ${selectedMenu === 'changer-parametre' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('changer-parametre')}>
          <div className="flex items-center mb-2 ">
            <GoGear className="mr-2" />
            Paramètres
          </div>
        </span>
        {currentUser && currentUser.role === 'admin' && (
          <div className='mb-4'>
        <span className={`mb-2 cursor-pointer ${selectedMenu === 'ajouter-employe' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('ajouter-employe')}>
          <div className="flex items-center">
            <AiOutlineTeam className="mr-2" />
            Ajouter un membre
          </div>
        </span>
        </div>
        )}
      <div className=" mt-2 border-b border-gray-300"></div>
      <ul>
      <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Accueil</div>
      <li className={`mb-2 cursor-pointer ${selectedMenu === 'update-home' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('update-home')}>
          <div className="flex items-center">
            <IoHomeOutline className="mr-2" />
            Modifier la page d'accueil
          </div>
        </li>
        <div className=" border-b border-gray-300"></div>
      <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Musique</div>
      <li className={`mb-2 cursor-pointer ${selectedMenu === 'ajouter-album' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('ajouter-album')}>
          <div className="flex items-center">
            <BiAlbum className="mr-2" />
            Ajouter/supprimer un album
          </div>
        </li>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'update-album' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('update-album')}>
          <div className="flex items-center">
            <BiAlbum className="mr-2" />
            Modifier un album
          </div>
        </li>
        <div className=" border-b border-gray-300"></div>
        <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Média</div>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'ajouter-image' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('ajouter-image')}>
          <div className="flex items-center">
            <BiPhotoAlbum className="mr-2" />
           Editeur de photo
          </div>
        </li>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'editer-article' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('editer-article')}>
          <div className="flex items-center">
            <GrArticle className="mr-2" />
            Editeur presse
          </div>
        </li>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'ajouter-video' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('ajouter-video')}>
          <div className="flex items-center">
            <CiYoutube className="mr-2" />
            Editeur de vidéo
          </div>
        </li>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'ajouter-radio' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('ajouter-radio')}>
          <div className="flex items-center">
            <IoIosRadio className="mr-2" />
            Editeur de radio
          </div>
        </li>
        <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Biographie</div>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'ajouter-bio' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('ajouter-bio')}>
          <div className="flex items-center">
            <BiPhotoAlbum className="mr-2" />
           Ajouter/Supprimer un article
          </div>
        </li>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'update-bio' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('update-bio')}>
          <div className="flex items-center">
            <BiPhotoAlbum className="mr-2" />
           Editer un article
          </div>
        </li>
        <div className=" border-b border-gray-300"></div>
        <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Dates</div>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'ajouter-date' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('ajouter-date')}>
          <div className="flex items-center">
            <BsCalendar2Date className="mr-2" />
            Editeur de date
          </div>
        </li>
        <div className="border-b border-gray-300"></div>
        <div className='bg-gray-100 p-1 font-semibold shadow mb-2'>Contact</div>
        <li className={`mb-2 cursor-pointer ${selectedMenu === 'update-lien' ? 'text-orange2' : 'hover:text-orange2'}`} onClick={() => handleMenuItemClick ('update-lien')}>
          <div className="flex items-center">
            <CiLink className="mr-2" />
            Mise à jour des liens Pro
          </div>
        </li>

      </ul>
    </div>
  );
};

