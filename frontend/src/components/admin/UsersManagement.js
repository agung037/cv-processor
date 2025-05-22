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
  Chip,
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import { admin } from '../../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await admin.getUsers();
      setUsers(response.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Gagal memuat data pengguna. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle user active status
  const handleToggleStatus = async (user) => {
    try {
      const updatedStatus = !user.is_active;
      const response = await admin.updateUserStatus(user.id, updatedStatus);
      
      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, is_active: updatedStatus } : u
      ));
      
      setActionSuccess(
        `Pengguna ${user.username} berhasil ${updatedStatus ? 'diaktifkan' : 'dinonaktifkan'}.`
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Gagal mengubah status pengguna. Silakan coba lagi.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await admin.deleteUser(selectedUser.id);
      
      // Update local state
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setActionSuccess(`Pengguna ${selectedUser.username} berhasil dihapus.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Gagal menghapus pengguna. Silakan coba lagi.');
      
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
        Manajemen Pengguna
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
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tanggal Daftar</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Tidak ada pengguna yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.is_active ? 'Aktif' : 'Nonaktif'} 
                          color={user.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={user.is_active ? <BlockIcon /> : <CheckCircleOutlineIcon />}
                          color={user.is_active ? 'warning' : 'success'}
                          onClick={() => handleToggleStatus(user)}
                          sx={{ mr: 1 }}
                        >
                          {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                        
                        <IconButton 
                          color="error"
                          onClick={() => openDeleteDialog(user)}
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
            Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.username}</strong>? 
            Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Batal</Button>
          <Button onClick={handleDeleteUser} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement; 