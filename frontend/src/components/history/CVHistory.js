import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { history } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CVHistory = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Load history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Fetch history from API
  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await history.getAll();
      setHistoryItems(response.history || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Gagal memuat riwayat CV. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // View CV analysis detail
  const handleViewDetail = (id) => {
    navigate(`/history/${id}`);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  // Delete history item
  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    try {
      await history.delete(selectedItem.id);
      
      // Update local state
      setHistoryItems(historyItems.filter(item => item.id !== selectedItem.id));
      setActionSuccess(`Riwayat CV berhasil dihapus.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete history item:', err);
      setError('Gagal menghapus riwayat CV. Silakan coba lagi.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      closeDeleteDialog();
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

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Riwayat Analisis CV
      </Typography>
      
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {actionSuccess}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama File</TableCell>
                  <TableCell>Tanggal Analisis</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Belum ada riwayat analisis CV
                    </TableCell>
                  </TableRow>
                ) : (
                  historyItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.original_filename}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetail(item.id)}
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        
                        <IconButton 
                          color="error"
                          onClick={() => openDeleteDialog(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus riwayat analisis CV ini? 
            Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Batal</Button>
          <Button onClick={handleDeleteItem} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CVHistory; 