import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { RadioListFr } from './RadioListFr';
import {Loader} from './Loader'; 
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'; 
import { useMediaQuery } from 'react-responsive';

export const RadioList = () => {
  const [radios, setRadios] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const { t, i18n } = useTranslation();
  const scrollContainerRef = useRef(null);
  const [displayedRadios, setDisplayedRadios] = useState(3);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const loadMoreRadios = () => {
    setDisplayedRadios(prevCount => prevCount + 3);
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollLeft - 800,
      behavior: 'smooth'
    });
  };
  
  const scrollRight = () => {
    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollLeft + 800,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(`${apiUrl}/api/radios`)
      .then(response => {
        setRadios(response.data);
        setIsLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching radios:'); 
      });
  }, []);

  return (
    <div className="relative my-9 ">
    <img src={logo} style={{pointerEvents: 'none'}} alt="Logo En Gramma" className='md:max-h-[500px] md:w-auto h-auto w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-2' />
    <div className="text-4xl  mb-4 text-white font-custom text-center md:mb-7 pt-5">RADIOS</div>
    <div className="text-2xl  mb-4 text-white font-custom text-center md:mb-4 pt-4">{t('radio.title')}</div>
    <div className='flex justify-center text-xl '>
      <p className='text-white my-4 '>{t('radio.world')}:</p>
    </div>
    {isLoading ? (
      <div className='flex justify-center items-center '>
        <Loader />
      </div>
    ) : (
      <div className={isMobile ? "flex flex-col items-center" : "flex items-center"}>
        {isMobile && [...radios].reverse().slice(0, displayedRadios).map(radio => (
          <div key={radio.id} style={{ flex: "0 0 auto", width: "100%" }} className="p-4 flex flex-col items-center ">
            <div className='bg-gray-100 border w-[300px] text-center px-4 rounded'>
            <img src={radio.image.replace('http://', 'https://')} alt={radio.description} className="w-auto mx-auto h-[75px] object-cover mb-4 rounded pt-1" />
              <div className="my-1 border-b border-gray-300 "></div>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18n.language === 'en' ? radio.pays : radio.country).replace(/\n/g, '<br />')) }} 
  className='font-semibold  mb-2'/>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18n.language === 'en' ? radio.descriptionEn : radio.description).replace(/\n/g, '<br />')) }} 
  className='text-gray-700'/>
            </div>
          </div>
        ))}
        {isMobile && displayedRadios < radios.length && (
          <button onClick={loadMoreRadios} className="underline text-orange2 text-lg font-semibold">
            {t('press.VplusR')}
          </button>
        )}
        {!isMobile && (
          <>
            <button onClick={scrollLeft} className='text-neutral-500 text-4xl ml-5'><SlArrowLeft/></button>
            <div ref={scrollContainerRef} className={`z-20 flex overflow-x-auto scrollbar-thumb-neutral-800 scrollbar-track-transparent scrollbar-thin scrollbar-corner-none`}>
            {[...radios].reverse().map(radio => (
                <div key={radio.id} style={{ flex: "0 0 auto", width: "33.33%" }} className="p-4 flex flex-col items-center ">
                  <div className='bg-gray-100 border w-[300px] text-center px-4 rounded'>
                  <img src={radio.image.replace('http://', 'https://')} alt={radio.description} className="w-auto mx-auto h-[75px] object-cover mb-4 rounded pt-1" />
                    <div className="my-1 border-b border-gray-300 "></div>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18n.language === 'en' ? radio.pays : radio.country).replace(/\n/g, '<br />')) }} 
      className='font-semibold  mb-2'/>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18n.language === 'en' ? radio.descriptionEn : radio.description).replace(/\n/g, '<br />')) }} 
      className='text-gray-700'/>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={scrollRight} className='text-neutral-500 text-4xl mr-5'><SlArrowRight /></button>
          </>
        )}
      </div>
    )}
    <RadioListFr />
  </div>
);

};

export default RadioList;