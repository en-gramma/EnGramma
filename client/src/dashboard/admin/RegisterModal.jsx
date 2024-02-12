import React, { useState } from 'react';
import axios from 'axios';
import DOMpurify from 'isomorphic-dompurify';

export const RegisterModal = ({ isOpen, onClose, onRegister }) => {
  // state des champs de formulaire
  const [formData, setFormData] = useState({
    username: DOMpurify.sanitize(''),
    email: DOMpurify.sanitize(''),
    password: DOMpurify.sanitize(''),
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // gestion des changements form
  const handleChange = (e) => {
    const { name, value  } = e.target;
    if (name === 'password') {
      setFormData({ ...formData, password: value });
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    // condition de validation du formulaire 
    if (!/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zÀ-ÿ\d@$!%*?&]{8,}$/.test(formData.password)) {
      setStatus('error');
      setStatusMessage('Le mot de passe doit contenir au moins 8 caractères, y compris au moins une lettre, un chiffre et un caractère @, $, !, %, *, ?, ou &.');
      return;
    }

    if (!/^[a-zA-Z0-9_-éèêàâùûôç]+$/u.test(formData.username)) {
      setStatus('error');
      setStatusMessage('Le nom d\'utilisateur ne doit contenir que des lettres, des chiffres, des tirets et des underscores.');
      return;
    }

    if (formData.password !== confirmPassword) {
      setStatus('error');
      setStatusMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    //regex email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setStatusMessage('Veuillez fournir une adresse e-mail valide.');
      return;
    }
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const requestData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
    
      await axios.post(`${apiUrl}/api/auth/register`, requestData, {
        withCredentials: true,
      });
      // réinitialisation des champs du formulaire et affichage d'un message de succès/erreur

      setFormData({
        username: '',
        email: '',
        password: '',
      });
      alert('Le formulaire a été soumis avec succès.');
      setStatus('success');
      setConfirmPassword('');
      onRegister(formData);

    } catch (err) {
      if (err) {
        alert('Erreur lors de la soumission du formulaire. Veuillez réessayer.');
        setStatus('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };

  return (
    <>
    {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
        <div className="bg-white min-w-[350px] rounded border-neutral-300 border p-3">
          <h2 className="text-xl font-bold mb-4">Ajouter un employé</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">
            Mot de passe :
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-400 w-full"
            autoComplete='new-password'
            required
          />
          <span className='text-sm'>Doit contenir au moins au moins 8 caractères dont, une lettre, un chiffre et un caractère spécial @, $, !, %, *, ?, &</span>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-600">
            Confirmez le mot de passe :
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className="border border-gray-400 w-full"
            autoComplete="new-password"
            required
          />
        </div>
        {status === 'success' && 
            <p className="text-green-700 font-semibold mb-2">L'utilisateur a été ajoutée avec succes</p>
          }

          {status === 'error' &&
            <p className="text-red-700 font-semibold mb-2">Erreur lors de l'ajout de l'utilisateur</p>
          }
          {status === 'error' && (
            <p className="text-red-700 font-semibold mb-2">
              {statusMessage}
            </p>
          )}
                <button
                type="submit"
                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mb-4"
              >
                Enregistrer un employé
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
