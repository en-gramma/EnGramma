import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';
import { Loader } from '../components/Loader';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslation } from 'react-i18next';

export const Bio = () => {

  const [bios, setBios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t} = useTranslation();

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
 
<div className="relative flex flex-col py-3 items-center p-5 pt-[100px]">
  {isLoading ? (
    <div className='flex justify-center items-center '>
      <Loader />
    </div>
  ) : null}

{bios.map(bio => (
  <div key={bio.id}>
    <div>
      <div className="flex items-center">
        <div className="flex-grow border-t border-white mr-1"></div>
        <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
        <div className="flex-grow border-t border-white "></div>
      </div>
      <div className='pt-2'>
        <h1 className=" text-white dropshadow-xl animate-fade animate-duration-[2500ms] text-center text-2xl font-custom">
          {t(bio.title + 'Title')}
        </h1>
        <h1 className=" text-white dropshadow-xl animate-fade animate-duration-[2500ms] text-center text-2xl font-custom">
        </h1>
        <div className="flex flex-col items-center justify-center sm:flex-row">
          <div className="relative  my-9 ">
            <img src={bio.image} alt="EN GRAMMA" className="object-cover rounded-lg flex justify-center md:h-[400px] md:w-[800px] h-[200px] w-[395px] shadow-xl md:px-0 md:px-1" />
            <p className="absolute bottom-0 right-0 text-white  px-3 py-1 text-xs">&copy; {bio.copyright}</p>
          </div>
        </div>
        <div className='max-w-[800px] mx-auto'>
          <div className="text-md text-white text-justify  mb-9 animate-fade-right">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(bio.title).replace(/\n/g, '<br />')) }} />
          </div>
        </div>
      </div>
    </div>
  </div>
))}
</div>
  )
}
