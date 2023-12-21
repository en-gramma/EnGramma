import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';
import {AiOutlineEdit } from 'react-icons/ai';
import { FaCheck } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";

export const ScheduleEditor = () => {
  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editedSchedule, setEditedSchedule] = useState(null);

  useEffect(() => {
    // Récupérer les horaires depuis le serveur
    async function fetchSchedules() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/schedules`);
        setSchedules(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des horaires :', error);
      }
    }

    fetchSchedules();
  }, []);

  const handleEditClick = (schedule) => {
    // ouvrir l'éditeur pour cet horaire
    setEditingSchedule(schedule);
    setEditedSchedule({ ...schedule });
  };

  const handleEditCancel = () => {
    // Annuler l'édition en cours
    setEditingSchedule(null);
    setEditedSchedule(null);
  };

  const handleEditSave = async () => {
    const purifiedSchedule = {
      ...editedSchedule,
      day: DOMPurify.sanitize(editedSchedule.day),
      openingM: DOMPurify.sanitize(editedSchedule.openingM),
      closingM: DOMPurify.sanitize(editedSchedule.closingM),
      openingA: DOMPurify.sanitize(editedSchedule.openingA),
      closingA: DOMPurify.sanitize(editedSchedule.closingA),
    
    };
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      // envoyer la mise à jour de l'horaire au serveur
      await axios.put(`${apiUrl}/api/schedules/${editedSchedule.id}`, purifiedSchedule, {
        withCredentials: true,
      });

      // mettre à jour l'état local des horaires
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === editedSchedule.id ? editedSchedule : schedule
      );
      setSchedules(updatedSchedules);

      // Fermer l'éditeur
      setEditingSchedule(null);
      setEditedSchedule(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'horaire :', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Liste des horaires</h2>
      <p>Veuillez définir les horaires sous le format <span className='text-red-700 font-semibold'>10:30</span></p> <br />
      <p className='mb-4'>Si le local est fermé, merci de bien vouloir éditer le champ avec une majuscule, un accent et dans les deux créneaux du matin ou de l'après midi <span className='text-red-700 font-semibold'>Fermé</span></p>
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-neutral-200">
            <th className="border border-gray-300 px-4 py-2">Jour</th>
            <th className="border border-gray-300 px-4 py-2">Ouverture matin</th>
            <th className="border border-gray-300 px-4 py-2">Fermeture matin</th>
            <th className="border border-gray-300 px-4 py-2">Ouverture après-midi</th>
            <th className="border border-gray-300 px-4 py-2">Fermeture après-midi</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{schedule.day}</td>
              {editingSchedule === schedule ? (
                <>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      name="openingM"
                      value={editedSchedule.openingM}
                      onChange={(e) =>
                        setEditedSchedule({ ...editedSchedule, openingM: e.target.value })
                      }
                      className="border border-gray-400 w-full px-4 py-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      name="closingM"
                      value={editedSchedule.closingM}
                      onChange={(e) =>
                        setEditedSchedule({ ...editedSchedule, closingM: e.target.value })
                      }
                      className="border border-gray-400 w-full px-4 py-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      name="openingA"
                      value={editedSchedule.openingA}
                      onChange={(e) =>
                        setEditedSchedule({ ...editedSchedule, openingA: e.target.value })
                      }
                      className="border border-gray-400 w-full px-4 py-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      name="closingA"
                      value={editedSchedule.closingA}
                      onChange={(e) =>
                        setEditedSchedule({ ...editedSchedule, closingA: e.target.value })
                      }
                      className="border border-gray-400 w-full px-4 py-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                  <button
                      onClick={handleEditSave}
                      className="text-green-600 hover:text-green-800 flex items-center">
                      <FaCheck  className="mr-1" />
                      Valider
                    </button>
                    <div className="mb-2 mt-2 border-b border-gray-300"></div>
                    <button
                      onClick={handleEditCancel}
                      className="text-red-600 hover:text-red-800 flex items-center">
                      <FcCancel  className="mr-1" />
                      Annuler
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border border-gray-300 px-4 py-2">{schedule.openingM}</td>
                  <td className="border border-gray-300 px-4 py-2">{schedule.closingM}</td>
                  <td className="border border-gray-300 px-4 py-2">{schedule.openingA}</td>
                  <td className="border border-gray-300 px-4 py-2">{schedule.closingA}</td>
                  <td className="border border-gray-300 px-4 py-2">
                  <button
                      onClick={() => handleEditClick(schedule)}
                      className="text-blue-600 hover:text-blue-800 flex items-center">
                      <AiOutlineEdit className="mr-1" />
                      Modifier
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};


