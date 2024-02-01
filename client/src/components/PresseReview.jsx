import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';

export const PressReview = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(`${apiUrl}/api/articles`)
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  return (
    <>
 <div className="relative pb-9 my-9">
  <img src={logo} alt="Logo En Gramma" className='md:h-full md:w-auto h-auto w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-2' />
  <div className="text-4xl font-bold mb-4 text-white font-custom text-center pt-9 mb-9">PRESSE</div>
  <div className="grid md:grid-cols-3 gap-4 ">
    {articles.map(article => (
      <div key={article.id} className="p-4 flex flex-col items-center text-lg">
        <img src={article.image} alt={article.name} className="w-auto h-[75px] object-cover mb-4 rounded" />
        <h2 className="mb-2"><span className='font-bold text-white'>{article.name}</span> <span className='italic text-white'>({article.country})</span></h2>
        <p className='text-white font-semibold'>{article.header}</p>
        <p className="text-white text-center">{article.text}</p>
      </div>
    ))}
  </div>
</div>
</>
  );
};