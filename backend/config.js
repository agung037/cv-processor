const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },
  database: {
    filename: process.env.DATABASE_URL || path.resolve(__dirname, 'red_cv.sqlite')
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'llama3-70b-8192',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-development-secret',
    expiresIn: '24h'
  }
}; 