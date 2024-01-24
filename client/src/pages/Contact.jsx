import React, { useState } from 'react';
import axios from 'axios';
import spaceimage from '../assets/spaceimage.jpg';
import logo2 from '../assets/logo.png';
import DOMPurify from 'isomorphic-dompurify';
import ReCAPTCHA from 'react-google-recaptcha';


export function Contact() {
 
  const currentDate = new Date();
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [submissionStatusErr, setSubmissionStatusErr] = useState('');
  const sitekey = process.env.REACT_APP_SITE_KEY;

  const initialFormData = {
    lastName: DOMPurify.sanitize(''),
    firstName: DOMPurify.sanitize(''),
    email: DOMPurify.sanitize(''),
    phone: DOMPurify.sanitize(''),
    message: DOMPurify.sanitize(''),
    object: DOMPurify.sanitize(''),
    date: currentDate,
  };

  const [formData, setFormData] = useState(initialFormData);

  // gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData({ ...formData, [name]: sanitizedValue });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;
  
    // vérification des regex
    const userRegex = /^[A-Za-zÀ-ÿ\s-]+$/;
    const phoneRegex = /^[\d\s\-+]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const objectRegex = /^[a-zA-Z0-9À-ÿ\s-]+$/;
    const messageRegex = /^[A-Za-zÀ-ÿ0-9\s.,\-!?'’()]+$/;
  
    if (!userRegex.test(formData.lastName) || !userRegex.test(formData.firstName)) {
      setSubmissionStatusErr('Le nom ne doit contenir que des lettres, des tirets et des espaces.');
      return;
    }
  
    if (!phoneRegex.test(formData.phone)) {
      setSubmissionStatusErr('Le numéro ne doit contenir que des chiffres, des espaces et des tirets.');
      return;
    }
  
    if (!emailRegex.test(formData.email)) {
      setSubmissionStatusErr('Veuillez entrer une adresse e-mail valide.');
      return;
    }
  
    if (!objectRegex.test(formData.object)) {
      setSubmissionStatusErr('L\'objet ne doit contenir que des lettres, des chiffres, des espaces et des tirets.');
      return;
    }
  
    if (!messageRegex.test(formData.message)) {
      setSubmissionStatusErr('Le message contient des caractères non autorisés.');
      return;
    }
  
    try {
      const captchaResponse = await axios.post(
        `${apiUrl}/api/recaptcha`,
        {
          response: formData.recaptcha,
        }
      );
  
      if (captchaResponse.data.success) {
        // si lee reCAPTCHA est valide, envoi du formulaire
        await axios.post(`${apiUrl}/api/messages`, formData, {
          withCredentials: true,
        });
        // réinitialisez le formulaire après l'envoi réussi
        setFormData({
          lastName: '',
          firstName: '',
          email: '',
          phone: '',
          message: '',
          object: '',
          date: '',
          recaptcha: '', 
        });
        setSubmissionStatus('Le message a été envoyé avec succès!');
      } else {
        console.error('Le reCAPTCHA est invalide');
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message', err);
      alert('Une erreur s\'est produite lors de l\'envoi du message.');
      setSubmissionStatus('Une erreur s\'est produite lors de l\'envoi du témoignage.');
    }
  };

const handleRecaptchaChange = (value) => {
  // update du state du recaptcha
  setFormData({ ...formData, recaptcha: value });
};

  return (
    <>
  <div className="h-screen relative overflow-hidden">
    <img src={spaceimage} alt="Music Background" className="object-cover w-full h-full bg-black bg-opacity-40 " />
    <img src={logo2} alt="En Gramma logo" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto h-[600px]  opacity-5 hidden md:block" />
    
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center overflow-auto no-scrollbar">
    <h2 className="text-3xl font-bold mb-4 text-white font-custom text-center pt-[200px] md:pt-[100px]">CONTACT</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-5 p-5">
      <div>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder='Nom'
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border px-3 p-1"
            required />
        </div>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            className="w-full border  px-3 p-1"
            required/>
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="object"
            name="object"
            placeholder='Objet'
            value={formData.object || ''}
            onChange={handleChange}
            className="w-full border px-3 p-1"/>
        </div>
        <div className="mb-2">
          <textarea
            id="message"
            name="message"
            placeholder='Message'
            value={formData.message}
            onChange={handleChange}
            className="w-full border rounded py-2 px-3 p-1"
            rows="4"
            required>
            </textarea>
        </div>
        {/* message erreur/succes */}
        {submissionStatus && (
            <p className="text-green-500 mb-2">{DOMPurify.sanitize(submissionStatus)}</p>
        )}
        {submissionStatusErr && (
            <p className="text-red-500 mb-2">{DOMPurify.sanitize(submissionStatusErr)}</p>
        )}

        {/* intégration Recaptcha + site key */}
        <ReCAPTCHA
        sitekey={sitekey}
        onChange={handleRecaptchaChange}
      />
        <button
          type="submit"
          className="bg-orange2 text-white py-2 px-4 mb-4 mt-2 rounded  hover:bg-orange-700 w-full">
          Envoyer
        </button>
      </form>
    </div>
    <div>
    <div>
        <div className="border rounded p-4 mb-4 text-white bg-slate-100 bg-opacity-20 md:ml-9 ml-0">
          <div className="flex items-center mb-2">
            
            <h2 className="text-2xl font-bold mb-4">Documents Pro</h2>
          </div>
            <p><a href="url_to_dossier_de_presse" className='text-orange2 hover:text-orange-700 pb-3 underline font-semibold'>Dossier de presse</a></p>
            <p><a href="url_to_fiche_technique" className='text-orange2 hover:text-orange-700 underline font-semibold'>Fiche technique</a></p>
        </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </>
  );
}