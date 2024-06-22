import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    version: '1.0.0',
    title: 'quiz API',
    description: 'quiz Api documentation',
  },
  components: {
    schemas: {
      salesSchema: {
        items: ['{item}'],
        totalAmount: 'number',
      },
    },
    parameters: {
      q: {},
    },
    securitySchemes: {
      access_token: {
        type: 'apiKey',
        name: 'access_token',
        in: 'header',
        description: 'Access token required for authentication',
      },
    },
  },
  schemes: ['http'],
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'localhost',
    },
  ],
}

const outputFile = './swagger-output.json'
const routes = ['./src/app.ts']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc)
