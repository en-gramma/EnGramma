import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const PressReview = () => {
  const [articles, setArticles] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/api/articles`)
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  return (
<div className="grid md:grid-cols-3 gap-4">
  {articles.map(article => (
    <div key={article.id} className="p-4 flex flex-col items-center">
      <img src={article.image} alt={article.name} className="w-auto h-[75px] object-cover mb-4 rounded" />
      <h2 className="mb-2"><span className='text-md font-bold text-white'>{article.name}</span> <span className='italic text-white'>({article.country})</span></h2>
      <p className='text-white font-semibold'>{article.header}</p>
      <p className="text-white">{article.text}</p>
    </div>
  ))}
</div>
  );
};