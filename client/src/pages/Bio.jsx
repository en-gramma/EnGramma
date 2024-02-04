import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';
import { Loader } from '../components/Loader';


export const Bio = () => {

  const [bios, setBios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
      <div className=" h-1 w-full flex-grow border-t border-white"></div>
    <div key={bio.id}>
      <h1 className=" text-white dropshadow-xl animate-fade animate-duration-[2500ms] text-center text-2xl">{bio.title} <span className='font-custom'>{bio.engramma}</span></h1>
      <div className="flex flex-col items-center justify-center sm:flex-row">
        <div className="relative  my-9 ">
          <img src={bio.image} alt="EN GRAMMA" className="object-cover w-full rounded-lg flex justify-center h-[350px] w-[680px] shadow-xl md:px-0 px-3" />
          <p className="absolute bottom-0 right-0 text-white  px-3 py-1 text-xs">&copy; {bio.copyright}</p>
        </div>
      </div>
      <div className='max-w-[700px] mx-auto'>
        <p className="text-md text-white text-justify  mx-3 mb-9 animate-fade-right">
          <div dangerouslySetInnerHTML={{ __html: bio.text }} />
        </p>
      </div>
    </div>
    </>
  ))}
</div>
  </>
  )
}
