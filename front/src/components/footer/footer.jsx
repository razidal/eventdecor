import React from 'react';
import { Box, Typography, Link ,Container} from '@mui/material';

export default function Footer() {
  return ( 
    <Box sx={{
      minHeight: '100vh', // Full viewport height
      display: 'flex',
      flexDirection: 'column',
    }}> {/* Added flex container styles */}   
    <Container component="main" sx={{ flexGrow: 1, py: 3 }}> {/* Added flexGrow and py for vertical centering */}   
      <Typography variant="body2" color="textSecondary" gutterBottom> {/* Added gutterBottom for bottom margin */}
        © {new Date().getFullYear()} - Event Decor. All rights reserved. {/* Updated the year dynamically */}
      </Typography> 
      <Typography variant="body2" color="textSecondary">
        Contact: <Link href="mailto:eventdeocr@gmail.com">eventdeocr@gmail.com</Link> {/* Added contact information */}   
      </Typography>
      </Container>
    </Box>
  );
}