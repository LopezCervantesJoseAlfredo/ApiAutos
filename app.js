const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const app = express();
const fs = require('fs');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://apiautos-production.up.railway.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');

const theme = new SwaggerTheme();
const options = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
};

app.use(express.static('/redoc.html'))

const readmeContent = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Autos',
      version: '1.0.0',
      description: readmeContent,
    },
    servers:[
      {url: "http://localhost:3000"}
    ], 
  },
  apis: [`${path.join(__dirname,"./routes/index.js")}`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs,options));  

// Ruta para la especificación de la API en formato JSON
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// Rutas de ejemplo para probar Swagger
app.get('/api/v1/example', (req, res) => {
  res.json({ message: 'Hello from example route' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'redoc.html')));

app.get('/redoc.html', (req, res)=>{
  res.sendFile(path.join(__dirname,'redoc.html'));
});

