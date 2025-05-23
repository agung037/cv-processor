'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const path = require('path');
const config = require('./config');
const { initializeDatabase } = require('./models/database');

// Import routes
const cvRoutes = require('./routes/cv');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const historyRoutes = require('./routes/history');

const init = async () => {
  // Initialize database
  try {
    await initializeDatabase();
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }

  const server = Hapi.server({
    port: config.server.port,
    host: config.server.host,
    routes: {
      cors: {
        origin: ['*'], // Allow all origins for development
        credentials: true // Allow cookies to be sent with CORS requests
      },
      files: {
        relativeTo: path.join(__dirname, '../frontend/build')
      }
    }
  });

  // Configure cookie auth
  server.state('token', {
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    isSecure: process.env.NODE_ENV === 'production', // HTTPS in production
    isHttpOnly: true,
    encoding: 'none',
    clearInvalid: true,
    strictHeader: true,
    path: '/'
  });

  // Register plugins
  await server.register(Inert);

  // Register routes
  server.route([
    // API routes
    ...cvRoutes,
    ...authRoutes,
    ...adminRoutes,
    ...historyRoutes,
    
    // Serve static frontend files
    {
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true
        }
      }
    }
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

init(); 