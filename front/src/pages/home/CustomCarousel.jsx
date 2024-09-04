import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const images = [
  './images/wedding.png',
  './images/slider2.png',
  './images/slider3.png',
'./images/slider4.png',
];

const CustomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Button onClick={handleBack}>
            <KeyboardArrowLeft />
          </Button>
        </Grid>
        <Grid item>
          <Box
            component="img"
            src={images[currentIndex]}
            alt="Carousel Slide"
            sx={{ height: 400, width: '100%', objectFit: 'cover' }}
          />
        </Grid>
        <Grid item>
          <Button onClick={handleNext}>
            <KeyboardArrowRight />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomCarousel;