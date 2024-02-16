import React, { useState } from 'react';
import axios from 'axios';
import Logo from '../assets/logo.png';
import DOMPurify from 'isomorphic-dompurify';

export const ForgotPassword = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [inputs, setInputs] = useState({ email: ''})


  const handleChange = (e) => {
    setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
          // verification du regex email
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(inputs.email)) {
            setError('Veuillez fournir une adresse e-mail valide.');
            return;
          }
    try {
      const sanitizedEmail = DOMPurify.sanitize(inputs.email);
      await axios.post(`${apiUrl}/api/passwordrecovery/forgot-password`, { email: sanitizedEmail  });
      setSuccess('Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail. ');
    } catch (error) {
      setError('Une erreure s\'est produite.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Réinitialisation du mot de passe
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
              Adresse e-mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={inputs.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange2 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              Envoyer
            </button>
            <div className='pt-5'>
            {error && <p className="text-red-700 font-semibold ">{error.toString()}</p>}
            {success && <p className="text-green-700 font-semibold">{success.toString()}</p>}
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};