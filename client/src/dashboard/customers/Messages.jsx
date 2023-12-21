import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {AiOutlineDelete} from 'react-icons/ai';


export const Messages= () => {
  const [messages, setMessages] = useState([]);

  //récupération des messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/messages`, {
          withCredentials: true,
        });

        //affiche les messages par ordre chronologique
        const sortedMessages = response.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    };

    fetchMessages();
  }, []); 

  //effacer un message
  const deleteMessage = async (messageId) => {
    try {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?');
      if (!confirmed) {
        return;
      }

      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.delete(`${apiUrl}/api/messages/${messageId}`, {
        withCredentials: true,
      });

      console.log(response.data);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du message :', error);
    }
};

  //conveti iso en date au format français
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
  
    // formatage de la date
    const dateString = date.toLocaleDateString(undefined, {
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  
    // formatage de l'heure 
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    // date affichée
    return `${dateString} à ${hours}:${minutes}:${seconds}`;
  }
  
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Liste des Messages</h2>
      <ul>
        {messages.map((message) => (
          <div key={message.id} className="bg-white p-4 mb-4 border rounded shadow w-full">
            <div className="flex justify-between">
              <div>
                {message.firstName} {message.lastName}
              </div>
              <div className="text-gray-400">{formatDate(message.date)}</div>
            </div>
            <div className="mt-2 border-b border-gray-300"></div>
            <div className="flex justify-between mt-2">
              <div>
                {message.email} <br/> 
              </div>
              <div className="text-gray-600">{message.phone}</div>
            </div>
            <div className="mt-2 border-b border-gray-300"></div>
          <div className='flex justify-between'>
            <div className="flex items-center">
              <h2 className="mt-2 font-semibold">{message.object}</h2>
            </div>
            <div>
              <button
                onClick={() => deleteMessage(message.id)}
              className="text-red-600 hover:text-red-800 flex items-center">
              <AiOutlineDelete className="mr-1" />
              Supprimer
              </button>
            </div>
          </div>
          <div className="text-gray-600 mt-2">{message.message}</div>
      </div>

        ))}
      </ul>

    </div>
  );
};


