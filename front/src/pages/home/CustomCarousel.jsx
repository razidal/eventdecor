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
    title: '🎉 Welcome to our Event Decoration! Enjoy our special offers!🎉',
    backgroundColor: '#f8bbd0',
  },
  {
    src: sliderimg,
    title: '🎉 Welcome to our Event Decoration! Enjoy our special offers!🎉',
    backgroundColor: '#b3e5fc',
  },
  {
    src: prod3,
    title: '🎉 Welcome to our Event Decoration! Enjoy our special offers!🎉',
    backgroundColor: '#c8e6c9',
  },
  {
    src: prod4,
    title: '🎉 Welcome to our Event Decoration! Enjoy our special offers!🎉',
    backgroundColor: '#fff9c4',
  }
];

const CustomCarousel = () => {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  const handlePrev = () => {
    if (animating) return;
    setDirection('left');
    setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    if (animating) return;
    setDirection('right');
    setIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (direction) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
        setDirection(null);
      }, 300); // Duration of the slide animation
      return () => clearTimeout(timer);
    }
  }, [index, direction]);

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="auto"
      minHeight="450px"
      bgcolor={images[index].backgroundColor}
      overflow="hidden"
    >
      <ButtonBase
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          left: '10px',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '50%',
          padding: '8px',
        }}
      >
        <ArrowBackIosNewIcon />
      </ButtonBase>

      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: direction === 'left' ? 'translateX(100%)' : direction === 'right' ? 'translateX(-100%)' : 'translateX(0)',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          key={index}
          sx={{
            flexShrink: 0,
            width: '100%',
            textAlign: 'center',
            opacity: animating ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={images[index].src}
            alt={`slide-${index}`}
            style={{
              width: '50%',
              maxHeight: '220px', // Set max height for images
              objectFit: 'cover',
              paddingBottom: '20px',
              marginBottom: '10px',
            }}
          />
          <Typography variant="h5" sx={{ px: 2, textAlign: 'center' }}>
            {images[index].title}
          </Typography>
        </Box>
      </Box>

      <ButtonBase
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: '10px',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '50%',
          padding: '8px',
        }}
      >
        <ArrowForwardIosIcon />
      </ButtonBase>
    </Box>
  );
};

export default CustomCarousel;
