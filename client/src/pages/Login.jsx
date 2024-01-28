import React, { useContext } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from'../assets/logo.png'
import axios from 'axios'
import DOMPurify from 'isomorphic-dompurify';

export const Login = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  // mise en place du state input
  const [inputs, setInputs] = useState({
    email: DOMPurify.sanitize(''),
    password: DOMPurify.sanitize('')
  })
  // mise en place du state error
  const [err, setError] = useState(null)

  const navigate = useNavigate()

  const {login} = useContext(AuthContext)

  // Ici on recupère la valeur courante du state pour la mettre a jour
  const handleChange = (e) => {
    setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
  }
  // on envoie les données du state au serveur
  const handleSubmit = async e => {
    e.preventDefault()
    try {

      // verification du regex password
      if (!/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zÀ-ÿ\d@$!%*?&]{8,}$/.test(inputs.password)) {
        setError('Format du mot de passe incorrect.');
        return;
      }
  
      // verification du regex email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(inputs.email)) {
        setError('Veuillez fournir une adresse e-mail valide.');
        return;
      }
      await Promise.all([login(inputs), axios.post(`${apiUrl}/api/auth/login`, inputs)]);
      navigate('/dashboard')
    } catch (err) {
      // Si il y a une erreur on la stock dans le state error
      setError('Erreur lors de la connexion')
    }
  }

  const handleResetPassword = () => {
    navigate('/forgot-password');
  };
  return (
  <>  

<div className="flex flex-col items-center justify-center h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company"/>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">Connexion au compte</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Email</label>
            <div className="mt-2">
              <input onChange={handleChange} id="email"
                name="email"
                type="email"
                autoComplete="email"
                required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password"
               className="block text-sm font-medium leading-6 text-white">Mot de passe</label>
            </div>
            <div className="mt-2">
              <input onChange={handleChange} 
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div>
            <button onClick={handleSubmit} type="submit"
             className="flex w-full justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">Se connecter</button>
              {err && <p className='text-red-700'>{err}</p>}  
          </div>
          <div>
              <button
                onClick={handleResetPassword}
                type="button"
                className="flex w-full justify-center rounded-md text-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 underline  hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                Réinitialiser le mot de passe
              </button>
            </div>
        </form>
      </div>
      </div>

  </>
  )
}