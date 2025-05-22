const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

// JWT Secret Key - should be in env variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'cv-processor-jwt-secret-key';
const TOKEN_EXPIRY = '24h';

/**
 * Generate JWT token for a user
 * @param {Object} user User object
 * @returns {String} JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify JWT token
 * @param {String} token JWT token
 * @returns {Object|null} Decoded token or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

/**
 * Hash a password
 * @param {String} password Plain text password
 * @returns {Promise<String>} Hashed password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 * @param {String} password Plain text password
 * @param {String} hashedPassword Hashed password
 * @returns {Promise<Boolean>} True if match, false otherwise
 */
async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword
}; 