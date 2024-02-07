import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';
import { Loader } from '../components/Loader';
import fr from "../assets/fr.png";
import en from "../assets/en.png";
import DOMPurify from 'isomorphic-dompurify';


export const Bio = () => {

  const [bios, setBios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(`${apiUrl}/api/bios`)
      .then(response => {
        setBios(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  }, []);
  return (
    <>
<div className="relative flex flex-col py-3 items-center p-5 pt-[100px]">
  {isLoading ? (
    <div className='flex justify-center items-center '>
      <Loader />
    </div>
  ) : null}

  {bios.map(bio => (
    <>
    
    <div>
     <div className="flex items-center">
     <div className="flex-grow border-t border-white mr-1"></div>
        <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
      <div className="flex-grow border-t border-white "></div>
    </div>
    <div className='flex items-center justify-center mx-auto my-3'>
  <img src={fr} alt="logo fr" className='h-5 w-7 mr-3 cursor-pointer' onClick={() => setLanguage('fr')} />
  <img src={en} alt="logo fr" className='h-5 w-7 cursor-pointer' onClick={() => setLanguage('en')} />
</div>
    <div key={bio.id} className='pt-2'>
    <h1 className=" text-white dropshadow-xl animate-fade animate-duration-[2500ms] text-center text-2xl font-custom">
    {language === 'fr' ? bio.title : bio.titleEn}
  </h1>
      <div className="flex flex-col items-center justify-center sm:flex-row">
        <div className="relative  my-9 ">
          <img src={bio.image} alt="EN GRAMMA" className="object-cover rounded-lg flex justify-center md:h-[400px] md:w-[780px] h-[200px] w-[395px] shadow-xl md:px-0 px-3" />
          <p className="absolute bottom-0 right-0 text-white  px-3 py-1 text-xs">&copy; {bio.copyright}</p>
        </div>
      </div>
      <div className='max-w-[800px] mx-auto'>
      <p className="text-md text-white text-justify  mb-9 animate-fade-right">
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((language === 'fr' ? bio.text : bio.textEn).replace(/\n/g, '<br />')) }} />
    </p>
      </div>
    </div>
    </div>
    </>
  ))}
</div>
  </>
  )
}
