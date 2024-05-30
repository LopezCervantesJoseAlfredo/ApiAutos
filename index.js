const fs = require('fs');
const path = require('path');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const morgan = require('morgan');
const redoc = require('redoc-express');
const autosRoutes = require('./routes/autos');
const OpenApiSnippet = require('openapi-snippet');
const app = express();

const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');

const theme = new SwaggerTheme();
const readmeContent = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');

const options = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
};

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

const openApiUrl = 'https://apiautos-production.up.railway.app/api-docs-json';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Autos',
      version: '1.0.0',
      description: readmeContent,
    },
    servers: [
      {
        url: 'https://apiautos-production.up.railway.app/',
        description: 'Servidor en Railway para API Autos',
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', 'autos.js')],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/redoc', redoc({
  title: 'API Autos',
  specUrl: openApiUrl,
}));

app.get(
  '/api-docs-redoc',
  redoc({
    title: 'API Docs',
    specUrl: '/api-docs-json',
    nonce: '',
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: '#6EC5AB'
          }
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: '15px',
          lineHeight: '1.5',
          code: {
            code: '#87E8C7',
            backgroundColor: '#4D4D4E'
          }
        },
        menu: {
          backgroundColor: '#ffffff'
        }
      }
    }
  })
);

app.get('/', function (req, res) {
  res.send('hello, world!');
});

app.use("/api-docs-json", (req, res) => {
  res.json(swaggerSpec);
});

app.use('/autos', autosRoutes);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { explorer: true },options));

app.listen(PORT, () => {
  console.log('Servidor Express escuchando en el puerto ' + PORT);
});
