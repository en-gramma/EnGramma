import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { Loader } from './Loader';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
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

  return (
<>
<div className="relative pb-9 my-9">
  <>
    <img src={logo} alt="Logo En Gramma" className='md:h-full md:max-h-[500px] md:w-auto h-auto w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-2' />
    <div className="text-4xl  mb-4 text-white font-custom text-center pt-9 mb-9">{t('press.press')}</div>
    {isLoading ? (
    <div className='flex justify-center items-center '>
    <Loader />
    </div>
  ) : (
<div className="flex justify-center ">
  <div className="grid md:grid-cols-3 gap-4">
  {articles.map(article => (
  <div key={article.id} className="p-4 flex flex-col items-center  mx-auto">
    <img src={article.image} alt={article.name} className="w-auto h-[75px] object-cover mb-4 rounded" />
    <h2 className="mb-2"><span className='font-bold text-white text-lg'>{article.name}</span> <span className='italic text-white'>({article.country})</span></h2>
    {t(i18n.language === 'en' ? article.headerEn : article.header) ? (
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18n.language === 'en' ? article.headerEn : article.header).replace(/\n/g, '<br />')) }} 
      className='text-white text-center font-semibold mb-2'/>
    ) : (
      <div style={{ height: '1em' }} className='mb-2' /> 
    )}
    <div className='flex items-center justify-center text-center'>
      <MdOutlineFormatQuote className='text-2xl text-orange2 ml-2 transform scale-x-[-1] mr-3' />
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18n.language === 'en' ? article.textEn : article.text).replace(/\n/g, '<br />')) }} 
      className='text-white text-center'/>
      <MdOutlineFormatQuote className='text-2xl text-orange2 ml-2  ml-3' />
    </div>
  </div>
    ))}
  </div>
</div>
  )}
  </>
</div>
</>
  );
};