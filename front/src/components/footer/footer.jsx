import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return ( 
    <Box sx={{ bgcolor: '#f8f8f8', p: 2, mt: 400, textAlign: 'center' }}> {/* Added mt: 4 for margin-top */}
      <Typography variant="body2" color="textSecondary" gutterBottom> {/* Added gutterBottom for bottom margin */}
        © {new Date().getFullYear()} - Event Decor. All rights reserved. {/* Updated the year dynamically */}
      </Typography> 
      <Typography variant="body2" color="textSecondary">
        Contact: <Link href="mailto:eventdeocr@gmail.com">eventdeocr@gmail.com</Link> {/* Added contact information */}   
      </Typography>
    </Box>
  );
}