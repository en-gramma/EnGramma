import React from 'react'
import logo from '../assets/logo.png'

 const Separator = () => {
  return (
    <div className="relative flex py-3 items-center p-5 pt-10">
    <div className="flex-grow border-t border-white mr-1"></div>
      <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
    <div className="flex-grow border-t border-white"></div>
  </div>
  )
}

export default Separator;