import React, { useState, useEffect } from 'react';
import axios from 'axios';
import spaceimage from '../assets/spaceimage.webp';
import logo2 from '../assets/logo.png';
import logo3 from '../assets/logotrans-min.webp';
import DOMPurify from 'isomorphic-dompurify';
import ReCAPTCHA from 'react-google-recaptcha';
import { CgMediaPodcast } from 'react-icons/cg';
import { GrScheduleNew } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';


export function Contact() {
 
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [submissionStatusErr, setSubmissionStatusErr] = useState('');
  const [links, setLinks] = useState([]);
  const sitekey = process.env.REACT_APP_SITE_KEY;
  const { t, i18n } = useTranslation();

  const initialFormData = {
    fullName: DOMPurify.sanitize(''),
    email: DOMPurify.sanitize(''),
    message: DOMPurify.sanitize(''),
    object: DOMPurify.sanitize(''),
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/links`, { withCredentials: true });
        setLinks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLinks();
  }, []);

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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const objectRegex = /^[\w\W\s]*$/;
    const messageRegex = /^[\w\W\s]*$/;
  
    if (!userRegex.test(formData.fullName)) {
      setSubmissionStatusErr('Le nom ne doit contenir que des lettres, des tirets et des espaces.');
      return;
    }
  
  
    if (!emailRegex.test(formData.email)) {
      setSubmissionStatusErr('Veuillez entrer une adresse e-mail valide.');
      return;
    }
  
    if (!objectRegex.test(formData.object)) {
      setSubmissionStatusErr('L\'objet contient des caractères non autorisés.');
      return;
    }
  
    if (!messageRegex.test(formData.message)) {
      setSubmissionStatusErr('L\'objet contient des caractères non autorisés.');
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
        // si le reCAPTCHA est valide, envoi du formulaire
        await axios.post(`${apiUrl}/api/messages`, formData, {
          withCredentials: true,
        });
        // réinitialisez le formulaire après l'envoi réussi
        setFormData({
          fullName: '',
          email: '',
          message: '',
          object: '',
          recaptcha: '', 
        });
        setSubmissionStatus('Le message a été envoyé avec succès!');
        setSubmissionStatusErr(''); // réinitialisez le message d'erreur
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
    <img src={logo2} alt="En Gramma logo" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto h-[600px]  opacity-3 hidden md:block" />
    
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
    <h2 className="text-3xl  mb-2 text-white font-custom text-center pt-[450px] md:pt-[100px]">CONTACT</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-3/5 mx-auto mt-3 p-5">
      <div>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder={t('contact.fullname')}
            value={formData.fullName}
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
            placeholder={t('contact.object')}
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
            className="w-full border rounded py-5 px-3 p-1 h-[150px]"
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
        <div className='flex justify-center w-full mb-1 md:justify-start'>
        <ReCAPTCHA
        sitekey={sitekey}
        onChange={handleRecaptchaChange}
        hl={i18n.language}
        className=''
      />
      </div>
        <button
          type="submit"
          className="bg-orange2 text-white text-shadow font-semibold py-2 px-4 mb-4 mt-2 rounded  hover:bg-orange-800 w-full md:max-w-[300px] ">
          {t('contact.button')}
        </button>

      </form>
    </div>
    <div>
    <div>
        <div className="border rounded p-2 mb-4 text-white bg-slate-100 bg-opacity-10 md:ml-9 ml-0">
          <div className="flex items-center mb-2 justify-center">
            
            <h2 className="text-2xl font-bold mb-2">{t('contact.pro')}</h2>
          </div>
          {links.map((link, index) => (
            <React.Fragment key={index}>
            <div className=''>
              <div className='flex items-center mb-2 justify-center '>
                <CgMediaPodcast className='text-orange2 text-xl '/>
                <p><a href={link.dossier} className='text-lg ml-2 text-orange2 hover:text-orange-700 pb-3 underline font-semibold' target="_blank" rel="noopener noreferrer">{t('contact.link')}</a></p>
              </div>
              <div className='flex items-center mb-4 justify-center'>
                <GrScheduleNew className='text-orange2 text-xl' />
                <p><a href={link.fiche} className='text-lg ml-2 text-orange2 hover:text-orange-700 underline font-semibold' target="_blank" rel="noopener noreferrer">{t('contact.linkTech')}</a></p>
              </div>
              <img src={logo3} alt="En Gramma" className='opacity-70 h-[150px] mx-auto' />
            </div>

          </React.Fragment>
              ))}
      
        </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </>
  );
}