import React, { useState, useEffect } from 'react';
import axios from 'axios';
import spaceimage from '../assets/spaceimage.webp';
import {Loader} from './Loader'; 
import 'photoswipe/style.css';

const VideoPlayer = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const divStyle = {
        backgroundImage: `url(${spaceimage})`,
    };

    useEffect(() => {
      
        const fetchVideos = async () => {
          try {
            setIsLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${apiUrl}/api/videos`);
            setVideos(response.data);
            setIsLoading(false);
          } catch (err) {
            console.error(err);
          }
        };
    
        fetchVideos();
    }, []);
    
    //extraction de l'url de la vidéo
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
<div style={divStyle} className="md:h-screen h-screen-105 bg-no-repeat bg-center bg-cover shadow-xl flex bg-black bg-opacity-40 items-center">
  <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center">
  <div className={`text-4xl text-white font-custom text-center mb-6 ${videos.length >= 3 ? 'md:mb-25' : 'md:mb-[50px]'} pt-[100px] md:pt-[140px]`}>VIDEOS</div>
                {isLoading ? (
                    <div className='flex justify-center items-center '>
                        <Loader />
                    </div>
                ) : (
                    <div className={`${videos.length > 2 ? "overflow-auto" : ""}  scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thin scrollbar-corner-20 max-h-[500px]`}>
                <div id="my-gallery" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {videos.slice().reverse().map((video) => {
                    const videoUrl = extractVideo(video.link);
                    return (
                        <div key={video.id} className="aspect-w-16 aspect-h-9 overflow-hidden mx-0 mb-6">
                        <iframe
                            className=' md:w-[560px] md:h-[315px] w-[340px] h-[225px]'
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
                )}
            </div>
        </div>
        </>
    );
};

export default VideoPlayer;