const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcrypt');

// Database setup
const dbPath = path.join(__dirname, '../database.sqlite');

// Initialize database connection
let db;

/**
 * Initialize the database and create tables if they don't exist
 */
async function initializeDatabase() {
  try {
    // Open the database
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    console.log('Database connected successfully');
    
    // Create users table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
        is_active INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create CV history table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS cv_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        analysis_result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create initial admin and users if they don't exist
    const adminExists = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
    const user1Exists = await db.get('SELECT * FROM users WHERE username = ?', ['user1']);
    const user2Exists = await db.get('SELECT * FROM users WHERE username = ?', ['user2']);
    
    const passwordHash = await bcrypt.hash('melonwater12', 10);
    
    if (!adminExists) {
      await db.run(
        'INSERT INTO users (username, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'admin@example.com', passwordHash, 'admin', 1]
      );
      console.log('Admin account created');
    }
    
    if (!user1Exists) {
      await db.run(
        'INSERT INTO users (username, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
        ['user1', 'user1@example.com', passwordHash, 'user', 1]
      );
      console.log('User1 account created');
    }
    
    if (!user2Exists) {
      await db.run(
        'INSERT INTO users (username, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
        ['user2', 'user2@example.com', passwordHash, 'user', 0]
      );
      console.log('User2 account created (inactive)');
    }
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

/**
 * Get database instance
 * @returns {Object} Database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDb
}; 