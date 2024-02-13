import React from 'react';

import ImageGallery from '../components/ImageGallery';
import { PressReview } from '../components/PresseReview';
import VideoPlayer from '../components/VideoPlayer';
import { RadioList } from '../components/RadioList';

export const Media = () => {
  return (
    <>
      <VideoPlayer />
      <PressReview />
      <ImageGallery />
      <RadioList />
    </>
  )
}
