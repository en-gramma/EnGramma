import React from 'react';
import {UserList} from '../admin/UserList';
import {AddAlbum} from '../albums/AddAlbum';
import {Messages} from '../customers/Messages';
import {ScheduleEditor} from '../admin/ScheduleEditor';
import {ServiceEditor} from '../admin/ServiceEditor';
import {TestimonialsValidation} from '../customers/testimonial/TestimonialsValidation';
import { TestimonialAdd } from '../customers/testimonial/TestimonialAdd';
import { UserSettings } from '../userPref/UserSettings';
import { DeleteAlbum } from '../albums/DeleteAlbum';

export const Content = ({ selectedMenuItem }) => {
  //espace réservé au contenu du dashboard
  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'ajouter-employe':
        return <div><UserList /></div>;
      case 'voir-messages':
        return <div><Messages /></div>;
      case 'changer-parametres':
        return <div><UserSettings /></div>;
      case 'ajouter-album':
        return <div><AddAlbum/></div>;
      case 'effacer-album':
        return <div><DeleteAlbum/></div>;
        case 'ajouter-temoignage':
        return <div><TestimonialAdd /></div>;
      case 'valider-temoignage':
        return <div><TestimonialsValidation /></div>;
      case 'modifier-services':
        return <div><ServiceEditor /></div>;
      case 'definir-horaires':
        return <div><ScheduleEditor /></div>;
      default:
        return <div><Messages /></div>;
    }
  };

  return (
    <>
      {renderContent()}
      </>
  );
};


