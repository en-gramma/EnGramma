import React from 'react'
import { ScaleLoader} from 'react-spinners';
import logo from '../assets/logo.png';

export const Loader = () => {
  return (
<div className="z-50 flex flex-col justify-center items-center ">
    <img src={logo} className="h-24 pb-3" alt="logo en gramma" />
    <ScaleLoader color="#ffffff" />
</div>
  )
}
