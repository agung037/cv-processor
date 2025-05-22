const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: 'localhost'
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || 'YOUR_GROQ_API_KEY',
    model: process.env.GROQ_MODEL || 'llama3-70b-8192',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions'
  }
}; 