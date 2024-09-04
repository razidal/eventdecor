import React, { useState, useEffect } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import sliderimg from "./wedding.png";
import slider4 from "./slider2.png";
import prod3 from "./slider3.png";
import prod4 from "./slider4.png";

const images = [
  {
    src: slider4,
    title: 'SPECIAL OFFER',
    text: 'Up to 50% discount when you purchase',
    backgroundColor: '#f8bbd0', // Light pink background
  },
  {
    src: sliderimg,
    title: 'SPECIAL OFFER',
    text: 'Up to 50% discount when you purchase',
    backgroundColor: '#b3e5fc', // Light blue background
  },
  {
    src: prod3,
    title: 'SPECIAL OFFER',
    text: 'Up to 50% discount when you purchase',
    backgroundColor: '#c8e6c9', // Light green background
  },
  {
    src: prod4,
    title: 'SPECIAL OFFER',
    text: 'Up to 50% discount when you purchase',
    backgroundColor: '#fff9c4', // Light yellow background
  }
];

const CustomCarousel = () => {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="500px"
      bgcolor={images[index].backgroundColor}
      overflow="hidden"
    >
      <ButtonBase
        onClick={handlePrev}
        sx={{ position: 'absolute', left: '10px', zIndex: 1 }}
      >
        <ArrowBackIosNewIcon />
      </ButtonBase>

      <Box textAlign="center">
        <img
          src={images[index].src}
          alt={`slide-${index}`}
          style={{ height: "296px", width: "313.53px", objectFit: 'cover' }}
        />
        <Typography variant="h3" className="slider-title">
          {images[index].title}
        </Typography>
        <Typography variant="body1" className="slider-text">
          {images[index].text}
        </Typography>
      </Box>

      <ButtonBase
        onClick={handleNext}
        sx={{ position: 'absolute', right: '10px', zIndex: 1 }}
      >
        <ArrowForwardIosIcon />
      </ButtonBase>
    </Box>
  );
};

export default CustomCarousel;
