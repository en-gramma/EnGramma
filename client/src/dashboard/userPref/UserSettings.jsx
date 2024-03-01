import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import DefaultUserImage from "../../assets/anon.png";
import { EditModal } from "../admin/EditModal";

export const UserSettings = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  //Ouvrir le modal de mise à jour
  const openUpdateModal = (userId) => {
    setSelectedUserId(userId); 
    setUpdateModalOpen(true);
  };
  
  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

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

// récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/auth/${currentUser.id}`, {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const loggedInUser = users.find(user => user.id === currentUser.id);
  return (
    <>
    
      <div className=" shadow-md rounded-md p-1 md:p-5 bg-white md:m-4  ">
        <h2 className="text-xl font-bold mb-4 ml-4 mt-2">Paramètres utilisateur</h2>
        <div className="mb-5 mt-2 border-b border-gray-300"></div>
        <div className="flex justify-center">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col justify-center">
            <div className=" mb-4">
              <div>
                {loggedInUser && (
                  <img
                    className="w-[150px] h-[150px] rounded-full md:mr-[150px] "
                    src={loggedInUser?.img ? loggedInUser.img.replace('http://', 'https://') : DefaultUserImage}
                    alt="User avatar"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col justify-center">
              <label className="font-bold mb-2">Nom d'utilisateur</label>
              <div className="flex items-center mb-4">
                <span className="mr-2">{currentUser?.username}</span>
              </div>
              <label className="font-bold mb-2">Email</label>
              <div className="flex items-center mb-4">
                <span className="mr-2">{currentUser?.email}</span>
              </div>
              <button
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2  mb-4 border border-gray-400 rounded shadow"
                onClick={() => openUpdateModal(currentUser.id)}
              >
                Editer
              </button>
            </div>
          </div>
        </div>

      </div>
      </div>
      {isUpdateModalOpen && (
        <EditModal
          isOpen={isUpdateModalOpen}
          onClose={closeUpdateModal}
          onUpdate={fetchUsers}
          user={users.find((user) => user.id === selectedUserId)}
          userId={selectedUserId}
        />
      )}
    </>
  );
};