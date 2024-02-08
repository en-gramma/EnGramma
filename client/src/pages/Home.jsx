import React, {useState, useEffect} from 'react'
import spaceImage from '../assets/spaceimage.jpg';
import logo from '../assets/logo.png';
import { Social } from '../components/Social';
import trioHome from '../assets/trio-home.jpg';
import fr from "../assets/fr.png";
import en from "../assets/en.png";


export const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const divStyle = {
    backgroundImage: `url(${spaceImage})`,
    // backgroundAttachment: 'fixed',
  };
  const [scrollPosition, setScrollPosition] = useState(0);


    // Fonction pour vérifier si la vue est en mode mobile
    const checkIsMobile = () => {
      // Logique de détection du mode mobile ici
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
  <span className="font-custom text-Engramma dropshadow-xl animate-fade-up animate-duration-[2500ms] ">EN GRAMMA</span>
</h1>
      </div>
      <div className='mt-auto z-20 animate-pulse animate-duration-1000 animate-once'>
        <Social />
        </div>
    </div>
    <div className="relative flex py-3 items-center p-5 pt-10">
      <div className="flex-grow border-t border-white mr-1"></div>
        <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
      <div className="flex-grow border-t border-white"></div>
    </div>
    <div className="flex flex-col items-center justify-center sm:flex-row sm:flex-row-reverse">
  <div className='flex items-center justify-center  mb-9 flex-col sm:flex-row mx-2'>
    {isMobile ? (
      <div className="relative w-full mt-4 sm:mt-0 mx-3">
        <img src={trioHome} alt="EN GRAMMA" className="object-cover w-full rounded h-auto max-h-[380px] shadow-lg " />
        <p className="absolute bottom-0 right-0 text-white  px-2 py-1 text-sm">&copy; Antoine Chevillé</p>
      </div>
    ) : null}

      <div className="max-w-[580px] sm:mr-4 pt-9 text-white text-justify">
              <b>EN GRAMMA</b> ('ène gramma') est un trio Transe Rock formé en 2021 et basé à Rennes. Issu du grec ancien, son nom évoque la marque que la mémoire laisse en nous à travers le temps.<br /><br />
      Le trio joue un mélange puissant de blues afro-dionysiaque et de rock acoustique, tout en chantant en trois langues (français, anglais et grec ancien). <br /><br /><a className='text-orange2 underline'href='/music'>Beau brûlis</a> est leur premier album.
      Il s'agit d'une collection d'histoires, enracinées dans le mystère et racontées à travers des mélodies vocales chaleureuses et des rythmes tribaux entraînants.<br /><br />
      EN GRAMMA est un groupe unique et musicalement éclectique, qui occupe l'espace entre le primitif et le moderne, l'acoustique et l'électrique.<br /><br />
      EN GRAMMA est formé par le chanteur Gautier Degandt qui a tourné à travers l'Europe avec son duo hard-folk <b>BÂTON BLEU</b> (Dixiefrog records/ PIAS), le guitariste afro/rock Oscar Philéas (<b>MAMADOU KOITA</b>), et le percussionniste Pierre-Yves Dubois.
      </div>
  </div>

  {!isMobile ? (
    <div className="relative mt-4 sm:mt-0 mx-3">
      <img src={trioHome} alt="EN GRAMMA" className="object-cover w-full rounded h-auto max-h-[27rem] shadow-lg " />
      <p className="absolute bottom-0 right-0 text-white  px-2 py-1 text-sm">&copy; Antoine Chevillé</p>
    </div>
  ) : null}
</div>


    </>
  );
};
