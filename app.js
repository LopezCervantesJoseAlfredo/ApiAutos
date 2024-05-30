const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const redoc = require('redoc-express');
const rte = require('./routes/autos');
const app = express();

// Configurar CORS
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8080;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Autos',
      version: '1.0.0',
      description: 'API para la gestión de autos',
    },
    servers: [
      {
        url: 'https://final-api-production.up.railway.app', // URL correcta de tu servidor
        description: 'Servidor en Railway para API Autos',
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', 'autos.js')],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/redoc', redoc({
  title: 'API Autos',
  specUrl: '/api-docs-json',
}));

app.use('/api-docs-json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { explorer: true }));

app.get('/', (req, res) => {
  res.send('hello, world!');
});

app.use('/autos', rte.router);

app.listen(PORT, () => {
  console.log('Servidor Express escuchando en el puerto ' + PORT);
});
