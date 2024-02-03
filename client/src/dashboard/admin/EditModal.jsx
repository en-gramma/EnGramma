import React, { useState } from 'react';
import axios from 'axios';
import DOMpurify from 'isomorphic-dompurify';

export const EditModal = ({ isOpen, onClose, onUpdate, user}) => {
    const [formData, setFormData] = useState({
      username: DOMpurify.sanitize(user.username),
      email: DOMpurify.sanitize(user.email),
      password: DOMpurify.sanitize(''),
      file: null
    });
  
    const [status, setStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleChangeImg = (e) => {
        const { name, type, files } = e.target;
        setFormData({
          ...formData,
          [name]: type === 'file' ? files[0] : formData[name],
        });
      };

  
    const uploadImage = async (file) => {

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error('Le fichier dépasse 5Mo');
        }
     
        try {
          //setup cloudinary
          const formData = new FormData();
          
          formData.append("file", file);
          formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      
          const response = await axios.post("https://api.cloudinary.com/v1_1/dvfel75pw/image/upload", formData, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          });
          // récupération de l'url et du nom du fichier
          return {
            url: response.data.url, 
            filename: file.name
          }
          
        } catch (error) {
          console.error(error);
        }
      };
  
      const handleSubmit = async (e) => {
        e.preventDefault();

        const apiUrl = process.env.REACT_APP_API_URL;
        // condition de validation du formulaire 
        await axios.delete(`${apiUrl}/api/auth/deleteImage/${user.id}`, {
            withCredentials: true,
          });

          //regex username
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(formData.username)) {
          setStatus('error');
          setStatusMessage('Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres, des tirets et des underscores.');
          return;
  }
    
        //regex email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
          setStatus('error');
          setStatusMessage('Veuillez fournir une adresse e-mail valide.');
          return;
        }
    
        if (formData.file && formData.file.size > 5 * 1024 * 1024) {
          setStatusMessage("Le fichier dépasse 5 Mo");
          return;
        }
        
        const { url, filename } = formData.file
        ? await uploadImage(formData.file)
        : { url: user.img, filename: user.filename };
  
      try {
        
        const requestData = {
            username: formData.username,
            email: formData.email,
            img: url,
            filename: filename,
          };
  
        await axios.put(`${apiUrl}/api/auth/${user.id}`, requestData, {
          withCredentials: true,
        });
        
        onUpdate();
        setStatus('success');
        setStatusMessage('L\'utilisateur a été mis à jour avec succès');
        onUpdate(formData);
      } catch (err) {
        setStatus('error');
        setStatusMessage('Erreur lors de la mise à jour de l\'utilisateur');
      }
    };
  
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white min-w-[350px] rounded border-neutral-300 border p-3">
              <h2 className="text-xl font-bold mb-4">Modifier les informations</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="file" className="block mb-2">Image de profil</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleChangeImg}
                        className="border border-gray-400 w-full"
                    />
                    </div>
                    <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-600">
                        Nom d'utilisateur :
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="border border-gray-400 w-full"
                        autoComplete='new-username'
                        required
                    />
                    </div>
                    <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-600">
                        Adresse e-mail :
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-400 w-full"
                        autoComplete='new-email'
                        required
                    />
                    </div>

  
                {status === 'success' && (
                  <p className="text-green-700 font-semibold mb-2">
                    {statusMessage}
                  </p>
                )}
  
                {status === 'error' && (
                  <p className="text-red-700 font-semibold mb-2">
                    {statusMessage}
                  </p>
                )}
                
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mb-4"
                >
                  Mettre à jour l'utilisateur
                </button>
              </form>
              <button
                className="text-red-600 hover:text-red-800 font-semibold"
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </>
    );
  };