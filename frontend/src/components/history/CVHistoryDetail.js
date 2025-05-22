import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { history } from '../../services/api';
import Results from '../Results';

const CVHistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historyItem, setHistoryItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load history item on component mount
  useEffect(() => {
    fetchHistoryItem();
  }, [id]);

  // Fetch history item from API
  const fetchHistoryItem = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await history.getById(id);
      setHistoryItem(response);
    } catch (err) {
      console.error('Failed to fetch history item:', err);
      setError('Gagal memuat detail riwayat CV. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigate back to history list
  const handleBackToHistory = () => {
    navigate('/history');
  };

  return (
    <Box>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link to="/history" style={{ textDecoration: 'none', color: 'inherit' }}>
          Riwayat
        </Link>
        <Typography color="text.primary">Detail</Typography>
      </Breadcrumbs>
      
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={handleBackToHistory}
        sx={{ mb: 3 }}
      >
        Kembali ke Daftar Riwayat
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : historyItem ? (
        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Detail Analisis CV
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" component="div">
                Nama File: <strong>{historyItem.historyItem?.original_filename}</strong>
              </Typography>
              <Typography variant="body2" component="div">
                Tanggal Analisis: {formatDate(historyItem.historyItem?.created_at)}
              </Typography>
            </Box>
          </Paper>
          
          {/* Display the CV analysis results */}
          <Results 
            advice={historyItem.historyItem?.analysis_result ? JSON.parse(historyItem.historyItem.analysis_result) : {}} 
            onReset={handleBackToHistory} 
          />
        </Box>
      ) : (
        <Alert severity="warning">
          Riwayat CV tidak ditemukan atau telah dihapus.
        </Alert>
      )}
    </Box>
  );
};

export default CVHistoryDetail; 