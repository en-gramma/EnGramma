import React, { useState, useEffect } from 'react';
import axios from 'axios';
import spaceimage from '../assets/spaceimage.jpg';
import 'photoswipe/style.css';

const VideoPlayer = () => {

    const [videos, setVideos] = useState([]);
    const divStyle = {
        backgroundImage: `url(${spaceimage})`,
        backgroundAttachment: 'fixed',
      };


    useEffect(() => {
        const fetchVideos = async () => {
          try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${apiUrl}/api/videos`);
            setVideos(response.data);
          } catch (err) {
            console.error(err);
          }
        };
    
        fetchVideos();
      }, []);
    
      const extractVideo = (iframeHtml) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(iframeHtml, 'text/html');
        const iframe = doc.querySelector('iframe');
        if (iframe) {
          return iframe.getAttribute('src');
        }
        return null;
      };
  
  return (
   <>
   
   <div style={divStyle} className="py-9 bg-no-repeat bg-center bg-cover shadow-xl flex bg-black bg-opacity-40 items-center flex-col">
  <div className="  top-0 left-0 right-0 bottom-0 flex flex-col items-center  "></div>
  <div className="text-2xl font-bold mb-4 text-white font-custom text-center">VIDEOS</div>

  <div id="my-gallery" className="flex flex-col md:flex-row justify-evenly w-full mt-4  ">
    {videos.map((video) => {
      const videoUrl = extractVideo(video.link);
      return (
        <div key={video.id} className="aspect-w-16 aspect-h-9 overflow-hidden m-2  ">
          <iframe
            className=' md:w-[560px] md:h-[315px] w-[400px] h-[225px] '
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    })}
  </div>
</div>
          </>
  );
};

export default VideoPlayer;