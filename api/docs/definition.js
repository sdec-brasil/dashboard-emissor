import { general } from '../src/config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
  // API informations (required)
    title: 'SDEC', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'API Pública do Sistema', // Description (optional)
  },
  host: `localhost:${general.port}`, // Host (optional)
  basePath: '/', // Base path (optional)
};

export default swaggerDefinition;
