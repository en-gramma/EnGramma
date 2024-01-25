import React from 'react';
import {UserList} from '../admin/UserList';
import {AddAlbum} from '../albums/AddAlbum';
import { UserSettings } from '../userPref/UserSettings';
import { DeleteAlbum } from '../albums/DeleteAlbum';
import { AddDate } from '../dates/AddDate';

export const Content = ({ selectedMenuItem }) => {
  //espace réservé au contenu du dashboard
  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'ajouter-employe':
        return <div><UserList /></div>;
      case 'changer-parametres':
        return <div><UserSettings /></div>;
      case 'ajouter-album':
        return <div><AddAlbum/></div>;
      case 'effacer-album':
        return <div><DeleteAlbum/></div>;
      case 'ajouter-date':
        return <div><AddDate/></div>;
      default:
        return <div><UserSettings /></div>;
    }
  };

  return (
    <>
      {renderContent()}
      </>
  );
};


