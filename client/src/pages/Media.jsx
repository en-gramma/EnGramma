import React from 'react';

import ImageGallery from '../components/ImageGallery';
import { PressReview } from '../components/PresseReview';
import VideoPlayer from '../components/VideoPlayer';
import { RadioList } from '../components/RadioList';

export const Media = () => {
  return (
    <>
      <ImageGallery />
      <PressReview />
      <VideoPlayer />
      <RadioList />
    </>
  )
}
