const config = require('./config');

console.log('Testing environment variables:');
console.log('GROQ API Key:', config.groq.apiKey);
console.log('Is default key?', config.groq.apiKey === 'YOUR_GROQ_API_KEY'); 