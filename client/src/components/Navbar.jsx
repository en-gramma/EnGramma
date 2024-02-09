import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Link, useLocation  } from 'react-router-dom';
import  {AuthContext}  from '../context/AuthContext';
import '../index.css'; 
import { useWindowWidth } from '@react-hook/window-size';
import DefaultUserImage from '../assets/anon.png';
import axios from 'axios';
import { CiLogout } from "react-icons/ci";
import englishFlag from '../assets/en.png';
import frenchFlag from '../assets/fr.png';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOnTop, setIsOnTop] = useState(true);  
    const { currentUser, logout } = useContext(AuthContext);
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const response = await axios.get(`${apiUrl}/api/auth/${currentUser.id}`, {
            withCredentials: true,
          });
          setUsers(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      if (currentUser) {
        fetchUsers();
      }
    }, [currentUser]);

    const toggleMenu = () => {
      setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };
  const handleLinkClick = async () => {
  await new Promise(resolve => setTimeout(resolve, 0));
  setIsMenuOpen(false);
};



    // state qui verifira quand l'ecran est en haut
    useEffect(() => {
      const handleScroll = () => {
        const isScrolledToTop = window.scrollY === 0;
        setIsOnTop(isScrolledToTop);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    //mediaquerie
    const isMobile = useWindowWidth() < 965; 
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };
    
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
    const opacity = location.pathname === '/' ? Math.min(scrollPosition / 200, 1) : 1;
    return (
<nav
  className={`${
    isOnTop && !isMobile ? 'bg-transparent text-xl' : 'bg-stone-900 opacity-95 text-xl z-30'
  } text-white border-gray-200 w-full z-20 fixed transition-all duration-300`}
  style={{
    backgroundColor: location.pathname === '/dashboard' ? '#2c2c2c' : ''
  }}
>
    <div className=" flex flex-wrap items-center justify-between mx-auto p-4 ">
          <a href="/" className="flex items-center">

          <p className={`font-custom text-4xl text-Engramma  md:hidden lg:block md:absolute  ${isOnTop ? '' :'text-Engramma'}`} style={{ opacity }}>
  EN GRAMMA
</p>
          </a>
          <div className="flex md:order-3">

            
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center rounded-md text-sm text-white md:hidden hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`}>
            <ul className="flex flex-col bg-stone-900 md:bg-transparent space-y-3 p-4  ml-auto md:space-y-0  md:p-0 mt-4 border border-stone-700  rounded-md  md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
              <li>
              <Link
                  className={`font-semibold ${location.pathname === '/' ? 'text-yellow-300' : ''} hover:text-yellow-300 `}
                  to="/"
                  onClick={handleLinkClick}
                > ACCUEIL
                </Link>
              </li>
              <li>
              <Link
                  className={`font-semibold ${location.pathname === '/music' ? 'text-yellow-300' : ''} hover:text-yellow-300`}
                  to="/music"
                  onClick={handleLinkClick}
                > MUSIQUE
                </Link>
              </li>
              <li>
              <Link
                  className={`font-semibold ${location.pathname === '/media' ? 'text-yellow-300' : ''} hover:text-yellow-300`}
                  to="/media"
                  onClick={handleLinkClick}
                > MEDIA
                </Link>
              </li>
              <li>
              <Link
                  className={`font-semibold ${location.pathname === '/bio' ? 'text-yellow-300' : ''} hover:text-yellow-300`}
                  to="/bio"
                  onClick={handleLinkClick}
                > BIOGRAPHIE
                </Link>
              </li>
              <li>
              <Link
                  className={`font-semibold ${location.pathname === '/tour' ? 'text-yellow-300' : ''} hover:text-yellow-300`}
                  to="/tour"
                  onClick={handleLinkClick}
                > DATES
                </Link>
              </li>
              <li>
              <Link
                  className={`font-semibold ${location.pathname === '/contact' ? 'text-yellow-300' : ''} hover:text-yellow-300`}
                  to="/contact"
                  onClick={handleLinkClick}
                > CONTACT/PRO
                </Link>
              </li>
              
              <li>
                <button onClick={() => changeLanguage('fr')}>
                  <img src={frenchFlag} alt="Français" className='w-[25px] h-[15px] mr-3' />
                </button>
                <button onClick={() => changeLanguage('en')}>
                  <img src={englishFlag} alt="English" className='w-[25px] h-[15px]' />
                </button>
              </li>
             
              <div className="mb-2 mt-2 border-b border-gray-300"></div>
              <li className="md:absolute md:top-2 md:right-10">
                  {currentUser &&
                <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
                  {users.map(user => (
                    <img
                      key={user.id} // assuming `id` is a unique property of `user`
                      className="w-[37px] h-[37px] rounded-full mr-2"
                      src={user?.img ? user.img.replace('http://', 'https://') : DefaultUserImage}
                      alt="User avatar"
                    />
                  ))}
                  <div className="grid grid-rows-2">
                    <span className="mr-2 text-base text-white">{currentUser?.username}</span>
                    <span className="text-gray-200 text-sm">{currentUser?.role}</span>
                  </div>
                  {isMenuOpen && (
                    <div className=" flex items-center text-white w-[230px] rounded menu text-base ml-10 md:shadow-md md:bg-neutral-800 md:opacity-95 md:absolute md:top-[75px] md:p-4 md:px-10 md:right-0">
                      <ul>
                      <li>
                    {currentUser &&              
                    <Link
                    className={`font-semibold ${location.pathname === '/dashboard' ? 'text-yellow-300' : ''} hover:text-yellow-300`}
                      to="/dashboard"
                      onClick={handleLinkClick}
                    > Tableau de bord
                    </Link>}
                  </li>
                        <li className="flex items-center pt-4">
                          <CiLogout className="mr-2" />
                          <button onClick={logout}>Déconnexion</button>
                        </li>              
                      </ul>
                    </div>
                  )}
                </div>
              }
            </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }