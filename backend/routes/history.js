const { getDb } = require('../models/database');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * Routes for CV history
 */
module.exports = [
  {
    method: 'GET',
    path: '/api/history',
    options: {
      pre: [{ method: authenticate }]
    },
    handler: async (request, h) => {
      try {
        const db = getDb();
        
        // Get user's CV history
        const history = await db.all(
          `SELECT id, filename, original_filename, created_at 
           FROM cv_history 
           WHERE user_id = ? 
           ORDER BY created_at DESC`,
          [request.user.id]
        );
        
        return { history };
      } catch (error) {
        console.error('Get history error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat mengambil riwayat CV.'
        }).code(500);
      }
    }
  },
  {
    method: 'GET',
    path: '/api/history/{id}',
    options: {
      pre: [{ method: authenticate }]
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const db = getDb();
        
        // Get specific CV history entry
        const historyItem = await db.get(
          `SELECT * FROM cv_history WHERE id = ? AND user_id = ?`,
          [id, request.user.id]
        );
        
        if (!historyItem) {
          return h.response({
            error: 'Riwayat CV tidak ditemukan.'
          }).code(404);
        }
        
        return { 
          historyItem,
          analysis: JSON.parse(historyItem.analysis_result || '{}') 
        };
      } catch (error) {
        console.error('Get history item error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat mengambil detail riwayat CV.'
        }).code(500);
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/history/{id}',
    options: {
      pre: [{ method: authenticate }]
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const db = getDb();
        
        // Check if history item exists and belongs to user
        const historyItem = await db.get(
          'SELECT * FROM cv_history WHERE id = ? AND user_id = ?',
          [id, request.user.id]
        );
        
        if (!historyItem) {
          return h.response({
            error: 'Riwayat CV tidak ditemukan.'
          }).code(404);
        }
        
        // Delete history item
        await db.run('DELETE FROM cv_history WHERE id = ?', [id]);
        
        return {
          message: 'Riwayat CV berhasil dihapus.',
          id: id
        };
      } catch (error) {
        console.error('Delete history error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat menghapus riwayat CV.'
        }).code(500);
      }
    }
  }
]; 