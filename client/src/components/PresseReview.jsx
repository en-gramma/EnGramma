import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { Loader } from './Loader';
import { useTranslation } from 'react-i18next';
import { MdOutlineFormatQuote } from "react-icons/md";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { useMediaQuery } from 'react-responsive';

export const PressReview = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [displayedArticles, setDisplayedArticles] = useState(3);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const loadMoreArticles = () => {
    setDisplayedArticles(prevCount => prevCount + 3);
  };

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollLeft - 600,
      behavior: 'smooth'
    });
  };
  
  const scrollRight = () => {
    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollLeft + 600,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(`${apiUrl}/api/articles`)
      .then(response => {
        setArticles(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  const Article = ({ article }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const text = t(i18n.language === 'en' ? article.textEn : article.text);
    const truncatedText = text.split(' ').length > 20 ? text.split(' ').slice(0, 22).join(' ') + '...' : text; 
  
    return (
      <div className="flex justify-center mx-auto text-md">
      <div key={article.id} className="p-4 flex flex-col items-center text-white md: mb-4">
      <img src={article.image.replace('http://', 'https://')} alt={article.name} className=" h-[75px] w-[75px] object-contains mb-4 rounded-full" />
          <h2 className="mb-2"><span className='font-bold text-white text-md'>{article.name}</span> <span className='italic text-white'>({article.country})</span></h2>
          {t(i18n.language === 'en' ? article.headerEn : article.header) && (
            <div className='text-center font-bold mb-2'>
              {t(i18n.language === 'en' ? article.headerEn : article.header).split('\n').map((text, index) => (
                <React.Fragment key={index}>
                  {text}
                  <br />
                </React.Fragment>
              ))}
            </div>
          )}
          <div className='flex items-center text-center'>
            <div className='flex h-[50px]'>
              <MdOutlineFormatQuote className='text-xl text-orange2  scale-x-[-1] mr-2 ' />
            </div>
            <div className={text.split(' ').length > 20 ? ' text-justify' : 'text-center'}>
              {(isExpanded ? text : truncatedText).split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
            <div className='flex h-[50px] align-items-center'>
              <MdOutlineFormatQuote className='text-xl text-orange2 ml-2 '/>
            </div>
          </div>
          {text.split(' ').length > 30 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="underline text-orange2 text-lg font-semibold">
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative pb-9 my-9">
      <>
        <img src={logo} style={{pointerEvents: 'none'}} draggable="false" alt="Logo En Gramma" className='md:h-full md:max-h-[500px] md:w-auto h-auto w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-2' />
        <div className="text-4xl  mb-4 text-white font-custom text-center pt-9 ">{t('press.press')}</div>
        {isLoading ? (
          <div className='flex justify-center items-center '>
            <Loader />
          </div>
        ) : (
          <div className={isMobile ? "flex flex-col items-center" : "flex items-center"}>
            {isMobile && [...articles].reverse().slice(0, displayedArticles).map(article => (
              <div key={article.id} style={{ flex: "0 0 auto", width: "100%" }}>
                <Article article={article} />
              </div>
            ))}
            {isMobile && displayedArticles < articles.length && (
              <button onClick={loadMoreArticles} className="underline text-orange2 text-lg font-semibold">
                Voir plus d'avis
              </button>
            )}
            {!isMobile && (
              <>
                <button onClick={scrollLeft} className='text-neutral-500 text-4xl ml-5'><SlArrowLeft/></button>
                <div ref={scrollContainerRef} className={`z-20 flex overflow-x-auto scrollbar-thumb-neutral-800 scrollbar-track-transparent scrollbar-thin scrollbar-corner-none`}>
                {[...articles].reverse().map(article => (
                  <div key={article.id} style={{ flex: "0 0 auto", width: "33.33%" }}>
                    <Article article={article} />
                  </div>
                ))}     
                </div>
                <button onClick={scrollRight} className='text-neutral-500 text-4xl mr-5'><SlArrowRight /></button>
              </>
            )}
          </div>
        )}
      </>
    </div>
  );
};
