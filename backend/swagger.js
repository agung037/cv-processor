const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package.json');

const swaggerOptions = {
  info: {
    title: 'RED CV Processor API Documentation',
    version: Pack.version,
    description: 'API for CV Analysis and User Management',
    contact: {
      name: 'RED CV Team',
      email: 'support@redcv.com'
    }
  },
  grouping: 'tags',
  tags: [
    {
      name: 'auth',
      description: 'Authentication and User Management Endpoints'
    },
    {
      name: 'cv',
      description: 'CV Analysis and Processing Endpoints'
    },
    {
      name: 'admin',
      description: 'Admin User Management Endpoints'
    },
    {
      name: 'history',
      description: 'CV Analysis History Endpoints'
    }
  ],
  documentationPath: '/docs',
  swaggerUIPath: '/swagger',
  jsonPath: '/swagger.json',
  schemes: ['http', 'https'],
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your JWT token with the "Bearer: " prefix'
    }
  },
  security: [{ jwt: [] }]
};

module.exports = {
  plugin: HapiSwagger,
  options: swaggerOptions
}; 