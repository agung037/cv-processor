const { verifyToken } = require('../utils/authUtils');
const { getDb } = require('../models/database');

/**
 * Authentication middleware
 * Verifies the JWT token and adds user info to the request
 */
const authenticate = async (request, h) => {
  try {
    // Check for authorization header or cookie
    const token = 
      request.headers.authorization?.split(' ')[1] || 
      request.state?.token;
    
    if (!token) {
      return h.response({ error: 'Akses ditolak. Token tidak ditemukan.' }).code(401).takeover();
    }
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return h.response({ error: 'Token tidak valid atau kedaluwarsa.' }).code(401).takeover();
    }
    
    // Get user from database to ensure they exist and are active
    const db = getDb();
    const user = await db.get(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (!user) {
      return h.response({ error: 'Pengguna tidak ditemukan.' }).code(401).takeover();
    }
    
    if (!user.is_active) {
      return h.response({ error: 'Akun belum diaktifkan oleh admin.' }).code(403).takeover();
    }
    
    // Add user information to request for access in handlers
    request.user = user;
    
    // Continue processing the request
    return h.continue;
  } catch (error) {
    console.error('Authentication error:', error);
    return h.response({ error: 'Terjadi kesalahan autentikasi.' }).code(500).takeover();
  }
};

/**
 * Authorization middleware
 * Checks if the authenticated user has the required role
 * @param {Array} roles Allowed roles
 */
const authorize = (roles) => {
  return async (request, h) => {
    try {
      // Check if user exists in request (authenticate middleware must run first)
      if (!request.user) {
        return h.response({ error: 'Autentikasi diperlukan.' }).code(401).takeover();
      }
      
      // Check if user role is allowed
      if (!roles.includes(request.user.role)) {
        return h.response({ error: 'Anda tidak memiliki izin untuk mengakses sumber daya ini.' }).code(403).takeover();
      }
      
      // Continue processing the request
      return h.continue;
    } catch (error) {
      console.error('Authorization error:', error);
      return h.response({ error: 'Terjadi kesalahan otorisasi.' }).code(500).takeover();
    }
  };
};

module.exports = {
  authenticate,
  authorize
}; 