import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper
} from '@mui/material';
import FileUpload from './FileUpload';
import Results from './Results';
import ConnectionStatus from './ConnectionStatus';

const Home = () => {
  const [advice, setAdvice] = useState(null);

  const handleResult = (result) => {
    setAdvice(result);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setAdvice(null);
  };

  return (
    <Container maxWidth="md">
      <ConnectionStatus />
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Analisis CV Profesional
        </Typography>
        
        {!advice ? (
          <FileUpload onResult={handleResult} />
        ) : (
          <Results advice={advice} onReset={handleReset} />
        )}
      </Paper>
    </Container>
  );
};

export default Home; 