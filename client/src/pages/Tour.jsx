import React, { useEffect, useState } from 'react';
import scene2 from '../assets/scene2.jpg';
import axios from 'axios';

export const Tour = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datesToShow, setDatesToShow] = useState(3);

const loadMoreDates = () => {
  setDatesToShow(prev => prev + 3);
};

const showThreeDates = () => {
  setDatesToShow(3);
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
      <p className="absolute bottom-0 right-0 text-white px-3 py-1 text-xs">&copy; Antoine Chevillé</p>
    <div>
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col items-center justify-center">
      <h1 className={`font-custom text-white z-10 text-3xl mb-8 ${datesToShow >= 6 ? 'pt-[100px]' : ''}`}>DATES</h1>

        {loading ? (
          <p>Loading dates...</p>
        ) : (
  <div className='overflow-auto no-scrollbar'>

{dates.slice().reverse().slice(0, datesToShow).map((date) => (
      <div key={date.id} className="mb-4 border-b border-white flex  items-start md:items-center md:justify-between w-full sm:w-[700px] last:mb-0 last:border-0  ">
        <div className="flex flex-row  w-full text-center mx-4 md:mx-0">
          <div className="text-column text-left mb-2 md:mb-0 w-1/2 mx-2">
            <p className="text-white mb-4 md:mb-4"><span className='text-3xl font-semibold mr-3 text-Engramma '>{`${date.day}`}</span> <span className='text-xl'>{`${date.month.substring(0, 4)}`}</span></p>
          </div>
          <div className="text-column md:flex md:flex-row  md:items-center  md:justify-between mb-2 md:mb-0  w-full">
            <p className="text-white font-semibold  text-2xl md:mb-4 "><span className=''>{`${date.place}`}</span></p>
            <p className="text-white  text-2xl mb-4 md:mb-4 "><span className=''>{`${date.city}`}</span></p>
          </div>
        </div>
      </div>
            ))}
          <div className='flex flex-col sm:flex-row items-center '>
            <button className='text-Engramma mt-4 flex items-start mr-5 ' onClick={loadMoreDates}>Afficher plus de dates</button>
            {datesToShow >= 6 && 
            <button className='text-Engramma mt-4 flex items-start ' onClick={showThreeDates}>Cacher les anciennes dates</button>
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
