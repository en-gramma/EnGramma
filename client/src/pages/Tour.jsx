import React, { useEffect, useState } from 'react';
import scene2 from '../assets/scene2.jpg';
import axios from 'axios';

export const Tour = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className='font-custom text-white z-10 text-3xl mb-8'>DATES</h1>
      {loading ? (
        <p>Loading dates...</p>
      ) : (
<div className=''>
  {dates.map((date) => (
    <div key={date.id} className="mb-4 border-b border-white flex  items-start md:items-center md:justify-between w-full sm:w-[600px] last:mb-0 last:border-0">
      <div className="flex flex-row  w-full">
        <div className="text-column text-left mb-2 md:mb-0 w-1/2 ">
          <p className="text-white mb-4 md:mb-2"><span className='text-3xl mr-3'>{`${date.day}`}</span> <span className='text-xl'>{`${date.month}`}</span></p>
        </div>
        <div className="text-column md:flex md:flex-row md:justify-around md:items-center text-left mb-2 md:mb-0 w-1/2 md:w-full">
          <p className="text-white  text-2xl mb-4 md:mb-2"><span className=''>{`${date.place}`}</span></p>
          <p className="text-white  text-2xl mb-4 md:mb-2"><span className=''>{`${date.city}`}</span></p>
        </div>
      </div>
    </div>
            
          ))}
        </div>
        
      )}
      </div>
    </div>
    </div>
</>


  );
};
