import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineDelete } from 'react-icons/ai';
import { RegisterModal } from './RegisterModal';
import { IoAdd } from "react-icons/io5";
import { IoIosRefresh } from "react-icons/io";
import DefaultUserImage from '../../assets/anon.png';

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };
  
  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/auth`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés');
    }
  };

  // Delete a user
  const handleDelete = async (userId) => {
    const shouldDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (shouldDelete) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.delete(`${apiUrl}/api/auth/${userId}`, {
          withCredentials: true  
        });
        // Update the user list after deletion
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'employé');
      }
    }
  };

  // Refresh the user list
  const handleRefresh = () => {
    fetchUsers();
  };

  return (
<div className="w-full shadow-md rounded-md p-1 md:p-5 bg-white md:m-4">
  <h2 className="text-xl font-bold  px-2 py-2 w-full">Liste des employés</h2>
  <div className="mb-5 mt-2 border-b border-gray-300"></div>
  <div className='flex items-center'>
    <button
      className="bg-blue-neutral hover:bg-blue-400 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow mb-2 flex items-center"
      onClick={handleRefresh}
    >
      <IoIosRefresh className="mr-1" /> Rafraîchir
    </button>
    <button
      className="ml-3 bg-neutral hover:bg-green-400 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow mb-2 flex items-center"
      onClick={openRegisterModal}
    >
      <IoAdd className="mr-1" /> Ajouter
    </button>
  </div>
  <div>
    <RegisterModal isOpen={showRegisterModal} onClose={closeRegisterModal} />
  </div>

  {users.length > 0 ? (
    <div className="overflow-x-auto max-w-full mt-5">
      <table className="min-w-full border-collapse rounded-md">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <th scope="col" className="px-4 py-3 text-left">
              Utilisateur
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              E-mail
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              Rôle
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3">
                <div className="flex items-center font-semibold">
                  <img
                    className="w-8 h-8 rounded-full mr-2"
                    src={user?.img ? user.img.replace('http://', 'https://'): DefaultUserImage}
                    alt={user?.title}
                  />
                  <span>{user.username}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span>{user.email}</span>
              </td>
              <td className="px-4 py-3">
                <span>{user.role}</span>
              </td>
              <td className="px-4 py-3">

              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 flex items-center"
              >
                <AiOutlineDelete className="mr-1" /> Supprimer
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>Aucun employé trouvé.</p>
  )}
</div>
  );
};