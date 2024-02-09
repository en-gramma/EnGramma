import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export const RadioListFr = () => {
  const [radiofrs, setRadiofrs] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(`${apiUrl}/api/radiofrs`)
      .then(response => {
        setRadiofrs(response.data);
      })
      .catch(error => {
        console.error('Error fetching radios:');
      });
  }, []);

  return (
    <>
  <div className='flex justify-center text-xl mt-5'>
    <p className='text-white my-4'>{t('radio.france')} :</p>
  </div>
  <div className="grid md:grid-cols-4 gap-4 ">
    {radiofrs.map(radio => (
       <div key={radio.id} className="p-4 flex flex-col items-center">
       <img src={radio.image} alt={radio.name} className="w-auto mx-auto h-[100px] object-cover mb-4 rounded pt-1" />
       </div>
    ))}
  </div>

</>
  );
};