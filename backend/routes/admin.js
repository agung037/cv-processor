const { getDb } = require('../models/database');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * Admin routes for user management
 */
module.exports = [
  {
    method: 'GET',
    path: '/api/admin/users',
    options: {
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    },
    handler: async (request, h) => {
      try {
        const db = getDb();
        
        // Get all users except the current admin
        const users = await db.all(
          `SELECT id, username, email, role, is_active, created_at 
           FROM users 
           WHERE id != ?
           ORDER BY created_at DESC`,
          [request.user.id]
        );
        
        return { users };
      } catch (error) {
        console.error('Get users error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat mengambil data pengguna.'
        }).code(500);
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/admin/users/{id}/status',
    options: {
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const { is_active } = request.payload;
        
        // Validate input
        if (typeof is_active !== 'boolean') {
          return h.response({
            error: 'Status aktivasi harus berupa boolean.'
          }).code(400);
        }
        
        const db = getDb();
        
        // Check if user exists
        const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
          return h.response({
            error: 'Pengguna tidak ditemukan.'
          }).code(404);
        }
        
        // Prevent changing admin status
        if (user.role === 'admin') {
          return h.response({
            error: 'Tidak dapat mengubah status admin.'
          }).code(403);
        }
        
        // Update user status
        await db.run(
          'UPDATE users SET is_active = ? WHERE id = ?',
          [is_active ? 1 : 0, id]
        );
        
        return {
          message: `Pengguna berhasil ${is_active ? 'diaktifkan' : 'dinonaktifkan'}.`,
          userId: id,
          is_active: is_active
        };
      } catch (error) {
        console.error('Update user status error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat mengubah status pengguna.'
        }).code(500);
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/admin/users/{id}',
    options: {
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        
        const db = getDb();
        
        // Check if user exists
        const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
          return h.response({
            error: 'Pengguna tidak ditemukan.'
          }).code(404);
        }
        
        // Prevent deleting admin
        if (user.role === 'admin') {
          return h.response({
            error: 'Tidak dapat menghapus admin.'
          }).code(403);
        }
        
        // Delete user
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        
        return {
          message: 'Pengguna berhasil dihapus.',
          userId: id
        };
      } catch (error) {
        console.error('Delete user error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat menghapus pengguna.'
        }).code(500);
      }
    }
  }
]; 