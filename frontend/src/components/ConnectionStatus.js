import React, { useState, useEffect } from 'react';
import { Alert, Box, Link } from '@mui/material';
import axios from 'axios';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    checking: true,
    connected: false,
    error: null
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get('/api/status');
        setStatus({
          checking: false,
          connected: true,
          error: null
        });
      } catch (error) {
        console.error('Backend connection error:', error);
        setStatus({
          checking: false,
          connected: false,
          error: error.message
        });
      }
    };

    checkConnection();
    // Check connection every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (status.checking) {
    return null;
  }

  if (!status.connected) {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert severity="error">
          Tidak dapat terhubung ke server backend. Pastikan server backend berjalan di port 3000.
          <br />
          Error: {status.error}
          <br />
          <Link href="#" onClick={() => window.location.reload()} color="inherit">
            Klik di sini untuk coba lagi
          </Link>
        </Alert>
      </Box>
    );
  }

  return null;
};

export default ConnectionStatus; 