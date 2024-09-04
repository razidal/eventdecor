import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import wedding from "./wedding.png";
import slider2 from "./slider2.png";
import slider3 from "./slider3.png";
import slider4 from "./slider4.png";


const images = [
  { src: wedding, caption: "Special Offer: Wedding Discount" },
  { src: slider2, caption: "Special Offer: Up to 50% Off" },
  { src: slider3, caption: "Exclusive: Limited Time Offer" },
  { src: slider4, caption: "Flash Sale: Don't Miss Out" }
];

const CustomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box sx={{ position: "relative", maxWidth: "100%", textAlign: "center" }}>
      <Box component="img" 
           src={images[currentIndex].src} 
           alt={images[currentIndex].caption}
           sx={{ width: "100%", height: "auto" }} 
      />
      <Typography variant="h6" sx={{ position: "absolute", bottom: 10, left: 0, right: 0, color: "#fff", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        {images[currentIndex].caption}
      </Typography>
      <Button onClick={handlePrev} sx={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)" }}>Prev</Button>
      <Button onClick={handleNext} sx={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }}>Next</Button>
    </Box>
  );
};


export default CustomCarousel;