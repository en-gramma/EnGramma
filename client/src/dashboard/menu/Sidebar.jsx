import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AiOutlineCar } from 'react-icons/ai';
import { AiOutlineTeam } from 'react-icons/ai';
import { AiOutlineEdit } from 'react-icons/ai';
import { GoGear } from "react-icons/go";


export const Sidebar = ({ onSelectMenuItem }) => {

  //on récupère le  nom d'utilisateur qu'on affichera dans le dashboard
  const {currentUser} = useContext(AuthContext)

  return (
    <div className=" bg-white rounded-md p-5 z-0  shadow pt-5 h-full md:bgwhite md:rounded-sm">
      <h2 className="text-lg font-bold mb-4 text-neutral-700">
          {currentUser?.username} - {currentUser?.role === 'admin' ? 'Administrateur': 
          currentUser?.role === 'staff' ? 'Employé' : currentUser?.role}</h2>
            <span className="mb-2 cursor-pointer" onClick={() => onSelectMenuItem('changer-parametres')}>
          <div className="flex items-center mb-4 hover:font-semibold">
            <GoGear className="mr-2" />
            Paramètres
          </div>
        </span>
      <div className="mb-4 border-b border-gray-300"></div>
      <ul>
      <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-image')}>
          <div className="flex items-center">
            <AiOutlineCar className="mr-2" />
            Ajouter une photo
          </div>
        </li>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('delete-image')}>
          <div className="flex items-center">
            <AiOutlineCar className="mr-2" />
            Effacer une photo
          </div>
        </li>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('editer-article')}>
          <div className="flex items-center">
            <AiOutlineCar className="mr-2" />
            Editeur presse
          </div>
        </li>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-video')}>
          <div className="flex items-center">
            <AiOutlineCar className="mr-2" />
            Editeur de vidéo
          </div>
        </li>
        <div className="mb-4 border-b border-gray-300"></div>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-album')}>
          <div className="flex items-center">
            <AiOutlineCar className="mr-2" />
            Ajouter un album
          </div>
        </li>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('effacer-album')}>
          <div className="flex items-center">
            <AiOutlineEdit className="mr-2" />
            Effacer un album
          </div>
        </li>

        <div className="mb-4 border-b border-gray-300"></div>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-date')}>
          <div className="flex items-center">
            <AiOutlineEdit className="mr-2" />
            Editeur de date
          </div>
        </li>
        <div className="mb-4 border-b border-gray-300"></div>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('update-lien')}>
          <div className="flex items-center">
            <AiOutlineEdit className="mr-2" />
            Mise à jour des liens Pro
          </div>
        </li>
        <div className="mb-4 border-b border-gray-300"></div>

        {currentUser && currentUser.role === 'admin' && (
          <>
        <li className="mb-2 cursor-pointer hover:font-semibold" onClick={() => onSelectMenuItem('ajouter-employe')}>
          <div className="flex items-center">
            <AiOutlineTeam className="mr-2" />
            Ajouter un membre
          </div>
        </li>
        </>
        )}
      </ul>
    </div>
  );
};

