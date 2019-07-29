// Imports
import mapRoutes from 'express-routes-mapper';
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';

// App Imports
import routes from '../routes';
import swaggerDefinition from '../../docs/definition';
import Auth from '../controllers/authorization/Auth';

// Setup RestAPI
export default function (server) {
  console.info('SETUP - RestAPI & Routes...');

  // Get all our routes and pair them with our controllers
  const mappedRoutes = mapRoutes(routes, 'src/controllers/');

  // Map our rotes to the /v1 endpoint
  server.use('/v1', mappedRoutes);

  // For demonstrations
  server.get('/', (req, res) => {
    res.status(200).send('Home Page');
  });
  server.post('/login', Auth.login);
  server.get('/account', Auth.account);


  // Options for the swagger docs
  const options = {
    swaggerDefinition,
    apis: ['./src/routes/**/*.js', './src/models/sdec/**/*.js'],
  };

  const swaggerSpec = swaggerJSDoc(options);

  fs.writeFile('./docs/swagger.json', JSON.stringify(swaggerSpec, null, 4), (err) => {
    if (err) console.log(`SETUP - Failed to create docs: ${err}`);
    else console.log('SETUP - Docs created');
  });

  server.get('/docs', (req, res) => res.send(swaggerSpec));
}
