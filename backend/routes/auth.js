const { getDb } = require('../models/database');
const { generateToken, comparePassword, hashPassword } = require('../utils/authUtils');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const Joi = require('joi');

/**
 * Authentication routes
 */
module.exports = [
  {
    method: 'POST',
    path: '/api/auth/register',
    options: {
      tags: ['api', 'auth'],
      description: 'Register a new user',
      validate: {
        payload: Joi.object({
          username: Joi.string().required().min(3).max(30),
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        })
      },
      response: {
        schema: Joi.object({
          message: Joi.string(),
          userId: Joi.number()
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { username, email, password } = request.payload;
        
        // Validate input
        if (!username || !email || !password) {
          return h.response({
            error: 'Username, email, dan password diperlukan.'
          }).code(400);
        }
        
        // Get database instance
        const db = getDb();
        
        // Check if user already exists
        const existingUser = await db.get(
          'SELECT * FROM users WHERE username = ? OR email = ?',
          [username, email]
        );
        
        if (existingUser) {
          return h.response({
            error: 'Username atau email sudah terdaftar.'
          }).code(409);
        }
        
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Insert new user
        const result = await db.run(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hashedPassword]
        );
        
        return h.response({
          message: 'Pendaftaran berhasil. Akun Anda akan diaktifkan oleh admin.',
          userId: result.lastID
        }).code(201);
      } catch (error) {
        console.error('Registration error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat mendaftar.'
        }).code(500);
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    options: {
      tags: ['api', 'auth'],
      description: 'User login',
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required()
        })
      },
      response: {
        schema: Joi.object({
          message: Joi.string(),
          user: Joi.object({
            id: Joi.number(),
            username: Joi.string(),
            email: Joi.string(),
            role: Joi.string()
          }),
          token: Joi.string()
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { username, password } = request.payload;
        
        // Validate input
        if (!username || !password) {
          return h.response({
            error: 'Username dan password diperlukan.'
          }).code(400);
        }
        
        // Get database instance
        const db = getDb();
        
        // Find user
        const user = await db.get(
          'SELECT * FROM users WHERE username = ?',
          [username]
        );
        
        if (!user) {
          return h.response({
            error: 'Username atau password tidak valid.'
          }).code(401);
        }
        
        // Check if account is active
        if (!user.is_active) {
          return h.response({
            error: 'Akun belum diaktifkan oleh admin.'
          }).code(403);
        }
        
        // Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
          return h.response({
            error: 'Username atau password tidak valid.'
          }).code(401);
        }
        
        // Generate token
        const token = generateToken(user);
        
        // Set cookie with token
        return h.response({
          message: 'Login berhasil',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          },
          token
        }).state('token', token).code(200);
      } catch (error) {
        console.error('Login error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat login.'
        }).code(500);
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    options: {
      tags: ['api', 'auth'],
      description: 'User logout',
      response: {
        schema: Joi.object({
          message: Joi.string()
        })
      }
    },
    handler: (request, h) => {
      return h.response({
        message: 'Logout berhasil'
      }).unstate('token').code(200);
    }
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    options: {
      tags: ['api', 'auth'],
      description: 'Get current user information',
      pre: [{ method: authenticate }],
      response: {
        schema: Joi.object({
          user: Joi.object({
            id: Joi.number(),
            username: Joi.string(),
            email: Joi.string(),
            role: Joi.string()
          })
        })
      }
    },
    handler: async (request, h) => {
      try {
        // User data is already in request.user from authenticate middleware
        return {
          user: request.user
        };
      } catch (error) {
        console.error('Get user error:', error);
        return h.response({
          error: 'Terjadi kesalahan saat mengambil data pengguna.'
        }).code(500);
      }
    }
  }
]; 