import React, { useEffect, useState } from 'react';
import scene2 from '../assets/scene2.webp';
import axios from 'axios';
import { Loader } from '../components/Loader';
import { useTranslation } from 'react-i18next';

export const Tour = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datesToShow, setDatesToShow] = useState(5);
  const { t, i18n } = useTranslation();
  const [showCopyright, setShowCopyright] = useState(true); 

  const loadMoreDates = () => {
    setDatesToShow(prev => prev + 5);
    setShowCopyright(false); 
  };

  const showThreeDates = () => {
    setDatesToShow(5);
    setShowCopyright(true); 
  };

  useEffect(() => {
    // récupération des albums
    async function fetchDates() {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/dates`);
        setDates(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des albums :', error);
      }
    }

    fetchDates();
  }, []);

  
  return (
  <>
    <div className="h-screen relative">
      <img src={scene2} alt="Music Background" className="object-cover w-full h-full" />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}></div>
      {showCopyright && <p className="absolute bottom-0 right-0 text-white px-3 py-1 text-xs z-0">&copy; Antoine Chevillé</p>}
    <div>
      <div className="absolute top-20 left-0 right-0 bottom-0 overflow-hidden flex flex-col items-center justify-center">
      <h1 className='font-custom text-white z-10 text-4xl  mb-3 md:pt-0 ' >DATES</h1>

        {loading ? (
                <div className='flex justify-center items-center '>
                <Loader />
              </div>
        ) : (
  <div className='overflow-auto no-scrollbar'>

{dates.slice().sort((a, b) => b.id - a.id).slice(0, datesToShow).map((date, index, arr) => {
  const day = String(date.day).padStart(2, '0');
  const showYearSeparator = index === 0 || date.year !== arr[index - 1].year;

        return (    
        <React.Fragment key={date.id}>
          {showYearSeparator && (
            <div className="year-separator text-center my-1 relative flex justify-center py-3 items-center  ">
              <span className='text-2xl text-white font-semibold'>{date.year}</span>
            </div>
          )}
          <div className="mb-4 border-b border-white flex  items-start md:items-center md:justify-between w-full sm:w-[800px] last:mb-0 last:border-0  ">
            <div className="flex flex-row  w-full text-center mx-4 md:mx-0">
              <div className="text-column text-left mb-2 md:mb-0 w-1/3 mx-2">
                  <p className="text-white mb-4 md:mb-4 animate-fade-right">
                  <span className='text-2xl font-semibold mr-3 text-Engramma'>{day}</span> 
                  <span className='text-xl '>
                  {i18n.language === 'en' ? date.monthEn.toUpperCase() : date.month.toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="text-column md:flex md:flex-rowtext-center md:items-center md:justify-between mb-2 md:mb-0  w-full">
              <p className="text-Engramma  md:text-xl text-lg md:mb-4 font-semibold "><span className=''>{`${date.place}`}</span></p>
              <p className="text-white  md:text-2xl text-xl mb-4 md:mb-4 animate-fade-left "><span className=''>{`${date.city}`}</span></p>
            </div>
            </div>
          </div>
              </React.Fragment>
        );
      })}
          <div className='flex flex-col sm:flex-row items-center mb-5'>
            <button className='text-Engramma mt-4 flex items-start mr-5 ' onClick={loadMoreDates}>{t('dates.hide')}</button>
            {datesToShow >= 6 && 
            <button className='text-Engramma mt-4 flex items-start ' onClick={showThreeDates}>{t('dates.show')}</button>
          }
          </div>
        </div>
          
        )}
        </div>
      </div>
      </div>
  </>

  );
};
