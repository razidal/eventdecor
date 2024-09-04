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
    backgroundColor: '#f8bbd0',
  },
  {
    src: sliderimg,
    title: 'SPECIAL OFFER',
    text: 'Up to 50% discount when you purchase',
    backgroundColor: '#b3e5fc',
  },
  {
    src: prod3,
    title: 'SPECIAL OFFER',
    text: 'Up to 50% discount when you purchase',
    backgroundColor: '#c8e6c9',
  },
  {
    src: prod4,
    title: 'SPECIAL OFFER',
    text: 'Up to 50% discount when you purchase',
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
      }, 100); // Duration of the slide animation
      return () => clearTimeout(timer);
    }
  }, [index, direction]);

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="400px"
      bgcolor={images[index].backgroundColor}
      overflow="hidden"
    >
      <ButtonBase
        onClick={handlePrev}
        sx={{ position: 'absolute', left: '10px', zIndex: 1 }}
      >
        <ArrowBackIosNewIcon />
      </ButtonBase>

      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: direction === 'left' ? 'translateX(100%)' : direction === 'right' ? 'translateX(-100%)' : 'translateX(0)',
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
          }}
        >
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
