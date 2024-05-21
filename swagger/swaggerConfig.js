const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for my API'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Auto: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID del auto'
            },
            marca: {
              type: 'string',
              description: 'Marca del auto'
            },
            modelo: {
              type: 'string',
              description: 'Modelo del auto'
            },
            year: {
              type: 'integer',
              description: 'Año del auto'
            }
          }
        }
      }
    }
  },
  apis: ['./path/to/your/router.js'] // Agrega la ruta de tu archivo de rutas aquí
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
