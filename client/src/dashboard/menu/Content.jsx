import React from 'react';
import {UserList} from '../admin/UserList';
import {AddAlbum} from '../albums/AddAlbum';
import { UserSettings } from '../userPref/UserSettings';
import { DeleteAlbum } from '../albums/DeleteAlbum';
import { AddDate } from '../dates/AddDate';
import { UpdateLinks } from '../links/UpdateLinks';
import { UploadImage } from '../images/UploadImage';
import { DeleteImage } from '../images/DeleteImage';
import { AddArticle } from '../articles/AddArticle';
import { AddVideo } from '../videos/AddVideo';

export const Content = ({ selectedMenuItem }) => {
  //espace réservé au contenu du dashboard
  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'ajouter-employe':
        return <div><UserList /></div>;
      case 'changer-parametres':
        return <div><UserSettings /></div>;
      case 'ajouter-image':
        return <div><UploadImage/></div>;
      case 'editer-article':
        return <div><AddArticle /></div>
      case 'ajouter-album':
        return <div><AddAlbum/></div>;
      case 'effacer-album':
        return <div><DeleteAlbum/></div>;
      case 'ajouter-date':
        return <div><AddDate/></div>;
      case 'update-lien':
        return <div><UpdateLinks/></div>;
      case 'delete-image':
        return <div><DeleteImage/></div>;
      case 'ajouter-video':
        return <div><AddVideo/></div>;
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


