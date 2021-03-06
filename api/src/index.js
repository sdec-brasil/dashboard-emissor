// Imports
import express from 'express';

// App Imports
import setupLoadModules from './setup/loadModules';
// import setupGraphQL from './setup/graphql';
import setupRestAPI from './setup/restAPI';
import setupStartServer from './setup/startServer';
import syncDatabase from './setup/syncDatabase';
import setupErrorHandlers from './setup/errorHandlers';
import { setupChainConnection } from './setup/chainConnection';
import setupExplorerListeners from './setup/explorerListeners';
import searchPreviousAuth from './setup/explorerPreviousAuth';
import models from './models';


// Create express server
const server = express();

// Setup load modules
setupLoadModules(server);

// Setup Rest API
setupRestAPI(server);

// Setup error handlers for the API
setupErrorHandlers(server);

// Setup GraphQL
// setupGraphQL(server);

// Sync Database
syncDatabase().then(() => {
  // start listening to explorer
  setupExplorerListeners();

  // check if we missed any authorizations while
  // the server was off.
  searchPreviousAuth();
});

// Start server
setupStartServer(server);

// Connect to chain
setupChainConnection();

export default server;
