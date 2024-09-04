import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: '#f8f8f8',
        p: 2,
        marginTop: '2000px',
        textAlign: 'center',
        position: 'relative', // Ensure the footer’s position is relative to its container
        width: '100%', // Ensure the footer takes the full width
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} - Event Decor. All rights reserved.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Contact: <Link href="mailto:eventdeocr@gmail.com">eventdeocr@gmail.com</Link>
      </Typography>
    </Box>
  );
}
