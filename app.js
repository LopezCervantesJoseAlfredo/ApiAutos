const fs = require('fs');
const path = require('path');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const morgan = require('morgan');
const redoc = require('redoc-express');
const rte = require('./routes/autos'); // Importa las rutas de autos
const app = express();

app.use(express.json());
app.use(cors());

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
        url: 'https://final-api-production.up.railway.app',
        description: 'Servidor en Railway para API Autos',
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', 'autos.js')], // Referencia correcta a las rutas
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/redoc', redoc({
  title: 'API Autos',
  specUrl: '/api-docs-json',
}));

app.get('/api-docs-redoc', redoc({
  title: 'API Docs',
  specUrl: '/api-docs-json',
}));

app.get('/', function (req, res) {
  res.send('hello, world!');
});

app.use("/api-docs-json", (req, res) => {
  res.json(swaggerSpec);
});

app.use('/autos', rte.router); // Usa las rutas de autos

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { explorer: true }));

app.listen(PORT, () => {
  console.log('Servidor Express escuchando en el puerto ' + PORT);
});
