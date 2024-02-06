import React, { useState, useEffect} from 'react'
import {Sidebar} from '../dashboard/menu/Sidebar'
import {Content} from '../dashboard/menu/Content'
import { CgMenuGridR } from "react-icons/cg";
import '../dashboard.css'

export const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const [isMobile, setIsMobile] = useState(false);
  
    //menu dashboard pour mobile
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const onSelectMenuItem = (menuItem) => {
      setSelectedMenuItem(menuItem);
      setIsSidebarOpen(false); 
    };

    // mobile mediaquerie
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 767);
      };

      handleResize(); 

      window.addEventListener('resize', handleResize); 
      return () => {
        window.removeEventListener('resize', handleResize); 
      };
    }, []);


  return (
    <>

<div className="flex flex-col md:flex-row pt-[80px]">
        <div
          className={`h-auto overflow-y-auto md:overflow-visible w-screen md:w-1/5 fixed md:relative top-[115px] border z-20 shadow-md md:m-4 md:top-0 left-0 md:left-auto bg-white  md:rounded-lg ${
            isSidebarOpen ? '' : 'hidden md:block'
          } `}
          style={{ maxHeight: window.matchMedia("(min-width: 768px)").matches ? 'none' : 'calc(100vh - 115px)' }}
        >
          <Sidebar onSelectMenuItem={onSelectMenuItem} />
        </div>
        <div className={`w-full md:w-3/4 ${isSidebarOpen ? 'ml-1/4' : ''} p-1 ${isMobile ? 'pt-[50px]' : ''}`} onClick={() => setIsSidebarOpen(false)}>
          <Content selectedMenuItem={selectedMenuItem} className="h-full " />
        </div>
      </div>

      <button
        className={`fixed top-[50px] left-0 p-3 mt-4  w-full md:hidden bg-gray-300 border-neutral-300 border text-black flex items-center`}
        onClick={toggleSidebar}
      >
        <CgMenuGridR className="mr-1" /> Menu
      </button>
    </>
  );
};

