import React, {useState, useEffect, Suspense} from 'react'
import spaceImage from '../assets/spaceimage.jpg';
import logo from '../assets/logo.png';
import trioHome from '../assets/trio-home.webp';
import { Trans } from 'react-i18next'
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const divStyle = {
    backgroundImage: `url(${spaceImage})`,
    // backgroundAttachment: 'fixed',
  };
  const [scrollPosition, setScrollPosition] = useState(0);
  const { i18n } = useTranslation();
  const [key, setKey] = useState(Math.random());
  const Social = React.lazy(() => import('../components/Social'));

  useEffect(() => {
    setKey(Math.random());
  }, [i18n.language]);


    // Fonction pour vérifier si la vue est en mode mobile
    const checkIsMobile = () => {
      // Logique de détection du mode mobile 
      const mobileWidth = 768; 
      const isMobile = window.innerWidth < mobileWidth;
      setIsMobile(isMobile);
    };
  
    // Appeler la fonction checkIsMobile à l'initialisation
    useEffect(() => {
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
      return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };
    
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
    const opacity = Math.max(1 - scrollPosition / 200, 0);

  return (
    <>
    <div style={divStyle} className="p-5 bg-no-repeat bg-center bg-cover h-screen shadow-xl flex bg-black bg-opacity-40 justify-center items-center">

      <div className="absolute inset-0 flex flex-col justify-center items-center ">
      <h1 className="text-5xl md:text-7xl" style={{ opacity }}>
        <span className="font-custom text-Engramma dropshadow-xl animate-fade animate-delay-[1000ms] ">EN GRAMMA</span>
      </h1>
      </div>
      <div className='absolute bottom-16 md:mt-auto z-20 animate-pulse animate-duration-1000 animate-once'>
      <Suspense fallback={<div>Chargement...</div>}>
      <Social />
    </Suspense>
        </div>
    </div>
    <div className="relative flex py-3 items-center p-5 pt-10">
      <div className="flex-grow border-t border-white mr-1"></div>
        <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
      <div className="flex-grow border-t border-white"></div>
    </div>
    <div className="flex flex-col items-center justify-center  sm:flex-row-reverse">
  <div className='flex items-center justify-center  mb-9 flex-col sm:flex-row mx-2'>
    {isMobile ? (
      <div className="relative w-full mt-4 sm:mt-0 mx-3 mb-7">
        <img loading="lazy" src={trioHome} alt="EN GRAMMA" className="object-cover w-full rounded h-auto max-h-[380px] shadow-lg " />
        <p className="absolute bottom-0 right-0 text-white  px-2 py-1 text-sm">&copy; Antoine Chevillé</p>
      </div>
    ) : null}

      <div key={key} className="max-w-[580px] sm:mr-4  text-white text-justify text-md">
      <Trans i18nKey="home.text" />
      </div>
  </div>

  {!isMobile ? (
    <div className="relative mt-4 sm:mt-0 mx-3 mb-9">
      <img  loading="lazy" src={trioHome} alt="EN GRAMMA" className="object-cover w-full rounded h-auto max-h-[27rem] shadow-lg " />
      <p className="absolute bottom-0 right-0 text-white  px-2 py-1 text-sm">&copy; Antoine Chevillé</p>
    </div>
  ) : null}
</div>


    </>
  );
};
