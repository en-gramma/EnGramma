import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';

export const RadioList = () => {
  const [radios, setRadios] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(`${apiUrl}/api/radios`)
      .then(response => {
        setRadios(response.data);
      })
      .catch(error => {
        console.error('Error fetching radios:');
      });
  }, []);

  return (
    <>
 <div className="relative pb-9">
  <img src={logo} alt="Logo En Gramma" className='md:h-full md:w-auto h-auto w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-3' />
  <div className="text-2xl font-bold mb-4 text-white font-custom text-center pt-9">RADIOS</div>

  <div className='flex justify-center'>
    <p className='text-white'>Dans le monde :</p>
  </div>
  <div className="grid md:grid-cols-3 gap-4">
    {radios.map(radio => (
       <div key={radio.id} className="p-4 flex flex-col items-center">
       <div className='bg-gray-100 border w-[300px] text-center px-4 rounded'>
       <img src={radio.image} alt={radio.name} className="w-auto mx-auto h-[75px] object-cover mb-4 rounded pt-1" />
       <div className="my-1 border-b border-gray-300 "></div>
       <h2 className="mb-2"> <span className=' font-semibold'>{radio.country}</span></h2>
       <p className='text-gray-700 '>{radio.description}</p>
       </div>
   </div>
    ))}
  </div>
</div>
</>
  );
};