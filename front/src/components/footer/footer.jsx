import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#f8f8f8', p: 2, mt: 4, textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        © {new Date().getFullYear()} - Event Decor. All rights reserved.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Contact: <Link href="mailto:eventdeocr@gmail.com">eventdeocr@gmail.com</Link>
      </Typography>
    </Box>
  );
}