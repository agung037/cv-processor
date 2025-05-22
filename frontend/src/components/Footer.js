import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: '#b71c1c', // Red accent line
          }
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} RED CV. Semua hak cipta dilindungi.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Dibuat oleh <Link href="https://github.com/agungkurn" target="_blank" rel="noopener" color="primary">Agung Kurniawan</Link>
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Footer; 