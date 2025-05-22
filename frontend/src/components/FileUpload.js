import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  LinearProgress,
  CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { cv } from '../services/api';

const FileUpload = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Check file type
    const fileType = selectedFile.type;
    if (fileType !== 'application/pdf' && 
        fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setError('Hanya file PDF dan DOCX yang didukung');
      setFile(null);
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    
    const droppedFile = event.dataTransfer.files[0];
    if (!droppedFile) return;
    
    // Check file type
    const fileType = droppedFile.type;
    if (fileType !== 'application/pdf' && 
        fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setError('Hanya file PDF dan DOCX yang didukung');
      return;
    }
    
    // Check file size (max 10MB)
    if (droppedFile.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB');
      return;
    }
    
    setFile(droppedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Pilih file terlebih dahulu');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await cv.analyze(file);
      
      if (result.error) {
        setError(result.error);
      } else if (result.advice) {
        onResult(result.advice);
      } else {
        setError('Terjadi kesalahan saat menganalisis CV');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Terjadi kesalahan saat mengunggah file');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          cursor: 'pointer',
          mb: 3
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        
        <UploadFileIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Unggah CV Anda
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seret dan lepaskan file PDF atau DOCX di sini, atau klik untuk memilih file
        </Typography>
        
        {file && (
          <Alert severity="success" sx={{ mt: 2 }}>
            File dipilih: {file.name}
          </Alert>
        )}
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          disabled={!file || loading}
          onClick={handleUpload}
          sx={{ minWidth: 200 }}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
              Menganalisis...
            </>
          ) : (
            'Analisis CV'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload; 