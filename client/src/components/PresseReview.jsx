import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { Loader } from './Loader';
import { useTranslation } from 'react-i18next';
import { MdOutlineFormatQuote } from "react-icons/md";

export const PressReview = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

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
      <div className="flex justify-center mx-auto">
      <div key={article.id} className="p-4 flex flex-col items-center text-white md:mx-[50px] mb-4">
          <img src={article.image} alt={article.name} className="w-auto h-[75px] w-[75px] object-contains mb-4 rounded-full" />
          <h2 className="mb-2"><span className='font-bold text-white text-lg'>{article.name}</span> <span className='italic text-white'>({article.country})</span></h2>
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
              <MdOutlineFormatQuote className='text-2xl text-orange2 ml-2 scale-x-[-1] mr-3 ' />
            </div>
            <div className={text.split(' ').length > 20 ? 'text-left text-justify' : 'text-center'}>
              {(isExpanded ? text : truncatedText).split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
            <div className='flex h-[50px] align-items-center'>
              <MdOutlineFormatQuote className='text-2xl text-orange2 ml-2  ml-3  '/>
            </div>
          </div>
          {text.split(' ').length > 30 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="underline text-orange2">
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
        <img src={logo} alt="Logo En Gramma" className='md:h-full md:max-h-[500px] md:w-auto h-auto w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-2' />
        <div className="text-4xl  mb-4 text-white font-custom text-center pt-9 mb-9">{t('press.press')}</div>
        {isLoading ? (
          <div className='flex justify-center items-center '>
            <Loader />
          </div>
        ) : (
      <div className={`grid md:grid-cols-3`}>
        {articles.map(article => <Article key={article.id} article={article} />)}
      </div>
        )}
      </>
    </div>
  );
};
