import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {Loader} from './Loader'; 
import { useTranslation } from 'react-i18next';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'; 
import { useMediaQuery } from 'react-responsive';

export const RadioListFr = () => {
  const [radiosFr, setRadiosFr] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const { t } = useTranslation();
  const scrollContainerRef = useRef(null);
  const [displayedRadios, setDisplayedRadios] = useState(4);
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
    axios.get(`${apiUrl}/api/radiofrs`)
      .then(response => {
        setRadiosFr(response.data);
        setIsLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching radios:'); 
      });
  }, []);

  return (
    <div className="relative my-9 ">
    <div className='flex justify-center text-xl '>
      <p className='text-white my-4 '>{t('radio.france')}:</p>
    </div>
    {isLoading ? (
      <div className='flex justify-center items-center '>
        <Loader />
      </div>
    ) : (
      <div className={isMobile ? "flex flex-col items-center" : "flex items-center"}>
      {isMobile && [...radiosFr].reverse().slice(0, displayedRadios).map(radio => (
        <div key={radio.id} style={{ flex: "0 0 auto", width: "100%" }} className="p-4 flex flex-col items-center ">
          <div className=''>
          <img src={radio.image.replace('http://', 'https://')} alt='Logo Radio' className="w-auto mx-auto h-[75px] object-cover mb-4 rounded pt-1" />
            </div>
          </div>
        ))}
        {isMobile && displayedRadios < radiosFr.length && (
          <button onClick={loadMoreRadios} className="underline text-orange2 ">
            Voir plus
          </button>
        )}
      {!isMobile && (
        <>
          {radiosFr.length > 4 && <button onClick={scrollLeft} className='text-neutral-500 text-4xl ml-5'><SlArrowLeft/></button>}
          <div ref={scrollContainerRef} className={`z-20 flex overflow-x-auto scrollbar-thumb-neutral-800 scrollbar-track-transparent scrollbar-thin scrollbar-corner-none`}>
            {[...radiosFr].reverse().map(radio => (
              <div key={radio.id} style={{ flex: "0 0 auto", width: "25%" }} className="p-4 flex flex-col items-center ">
                <div className='w-[300px] text-center'>
                <img src={radio.image.replace('http://', 'https://')} alt='Logo Radio' className="w-auto mx-auto h-[75px] object-cover mb-4 rounded pt-1" />
                </div>
              </div>
            ))}
          </div>
          {radiosFr.length > 4 && <button onClick={scrollRight} className='text-neutral-500 text-4xl mr-5'><SlArrowRight /></button>}
        </>
        )}
      </div>
    )}
  </div>
);

};
