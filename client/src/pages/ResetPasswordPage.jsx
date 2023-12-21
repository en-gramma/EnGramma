import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Logo from '../logo.svg'
import DOMPurify from 'isomorphic-dompurify';

export const ResetPasswordPage = () => {
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess]= useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const sanitizedToken = DOMPurify.sanitize(token);
      const sanitizedPassword = DOMPurify.sanitize(password);

      if (!/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zÀ-ÿ\d@$!%*?&]{8,}$/.test(sanitizedPassword)) {
        setError(
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p className="mb-2">Format du mot de passe incorrect, doit contenir:</p>
            <ul className="list-disc list-inside">
              <li>Au moins 8 caractères</li>
              <li>Au moins un chiffre</li>
              <li>Au moins un des caractères @, $, !, %, *, ?, ou &</li>
            </ul>
          </div>
        );
        return;
      }
      
      await axios.post(`${apiUrl}/api/passwordrecovery/reset-password`, {
        token: sanitizedToken, // Remplacez par votre propre token de réinitialisation
        password: sanitizedPassword,
      });

      // Réinitialisation réussie, rediriger l'utilisateur vers une page de confirmation
      setSuccess('Votre mot de passe a été réinitialisé.')
    } catch (error) {
      setError('Une erreur s\'est produite lors de la réinitialisation du mot de passe.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" />
        <h1 className="text-2xl font-bold mb-6 text-center">Réinitialisation du mot de passe </h1>
        {success ? (
          <div className='text-center'>
            <p className="text-green-600 mb-4 text-lg border border-green-800 py-5 px-4  rounded-md">{success}</p>
            <Link to="/login" className="text-blue-500 font-semibold underline ">Se connecter</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white rounded py-2">Réinitialiser le mot de passe</button>
          </form>
        )}
      </div>
    </div>
  );
};

