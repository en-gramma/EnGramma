import React from 'react'
import logo from '../assets/logo.png';
import livre from '../assets/livre.jpg';
import symballes from '../assets/symballes.jpg';

export const Bio = () => {
  return (
    <>
    <div className="relative flex py-3 items-center p-5 pt-[100px]">
    <div className="flex-grow border-t border-white mr-1"></div>
      <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
    <div className="flex-grow border-t border-white"></div>
  </div>

  <h1 className=" text-white dropshadow-xl animate-fade animate-duration-[2500ms] text-center text-2xl">Bio du projet <span className='font-custom'>EN GRAMMA</span></h1>
  <div className="flex flex-col items-center justify-center sm:flex-row">
  <div className="relative  my-9 ">
    <img src={livre} alt="EN GRAMMA" className="object-cover w-full rounded-lg flex justify-center h-auto max-w-[675px] shadow-xl md:px-0 px-3" />
    <p className="absolute bottom-0 right-0 text-white  px-3 py-1 text-xs">&copy; Antoine Chevillé</p>
  </div>
  </div>
  <div className='max-w-[700px] mx-auto'>
  <p className="text-sm text-white text-justify  mx-3 mb-9 animate-fade-right">
      <b>EN GRAMMA</b> ('ène gramma') est un trio Transe Rock formé en 2021 et basé à Rennes. Issu du grec ancien, son nom évoque la marque que la mémoire laisse en nous à travers le temps.<br /><br />
      Le trio joue un mélange puissant de blues afro-dionysiaque et de rock acoustique, tout en chantant en trois langues (français, anglais et grec ancien). <br /><br /><a className='text-orange-600 underline'href='/music'>Beau brûlis</a> est leur premier album.
      Il s'agit d'une collection d'histoires, enracinées dans le mystère et racontées à travers des mélodies vocales chaleureuses et des rythmes tribaux entraînants.<br /><br />
      EN GRAMMA est un groupe unique et musicalement éclectique, qui occupe l'espace entre le primitif et le moderne, l'acoustique et l'électrique.<br /><br />
      EN GRAMMA est formé par le chanteur Gautier Degandt qui a tourné à travers l'Europe avec son duo hard-folk <b>BÂTON BLEU</b> (Dixiefrog records/ PIAS), le guitariste afro/rock Oscar Philéas (<b>MAMADOU KOITA</b>), et le percussionniste Pierre-Yves Dubois.
    </p>
  </div>

  <div className="relative flex py-3 items-center p-5 ">
    <div className="flex-grow border-t border-white mr-1"></div>
      <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
    <div className="flex-grow border-t border-white"></div>
  </div>

  <h1 className="text-white dropshadow-xl animate-fade animate-duration-[2500ms] text-center text-2xl">
  Au sujet de l'album{' '} {/* Add a space here */}
  <span className='font-custom'>BEAU BRÛLIS</span>
</h1>

  <div className="flex flex-col items-center justify-center sm:flex-row">
  <div className="relative  my-9 ">
    <img src={symballes} alt="EN GRAMMA" className="object-cover w-full rounded-lg flex justify-center h-auto max-w-[675px] shadow-xl md:px-0 px-3" />
    <p className="absolute bottom-0 right-0 text-white  px-3 py-1 text-xs">&copy; Antoine Chevillé</p>
  </div>
  </div>
  <div className='max-w-[700px] mx-auto'>
  <p className="text-sm text-white text-justify  mx-3 mb-9 animate-fade-right">
      <b>EN GRAMMA</b> ('ène gramma') est un trio Transe Rock formé en 2021 et basé à Rennes. Issu du grec ancien, son nom évoque la marque que la mémoire laisse en nous à travers le temps.<br /><br />
      Le trio joue un mélange puissant de blues afro-dionysiaque et de rock acoustique, tout en chantant en trois langues (français, anglais et grec ancien). <br /><br /><a className='text-orange-600 underline'href='/music'>Beau brûlis</a> est leur premier album.
      Il s'agit d'une collection d'histoires, enracinées dans le mystère et racontées à travers des mélodies vocales chaleureuses et des rythmes tribaux entraînants.<br /><br />
      EN GRAMMA est un groupe unique et musicalement éclectique, qui occupe l'espace entre le primitif et le moderne, l'acoustique et l'électrique.<br /><br />
      EN GRAMMA est formé par le chanteur Gautier Degandt qui a tourné à travers l'Europe avec son duo hard-folk <b>BÂTON BLEU</b> (Dixiefrog records/ PIAS), le guitariste afro/rock Oscar Philéas (<b>MAMADOU KOITA</b>), et le percussionniste Pierre-Yves Dubois.
    </p>
  </div>
  </>
  )
}
