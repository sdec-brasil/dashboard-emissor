// Imports
import { Sequelize } from 'sequelize';

// App Imports
import env from '../config/env';
import databaseConfig from '../config/database.json';

// Load database config
const databaseConfigEnv = databaseConfig[env];

const opts = {
  define: {
    freezeTableName: true,
  },
};

// Create new database connection
const connection = new Sequelize(
  databaseConfigEnv.database,
  databaseConfigEnv.username,
  databaseConfigEnv.password,
  {
    host: process.env.DB_HOST || databaseConfigEnv.host,
    dialect: databaseConfigEnv.dialect,
    logging: false,
    operatorsAliases: Sequelize.Op,
    port: process.env.DB_PORT || databaseConfigEnv.port,
  },
  opts,
);

// Test connection
console.info('SETUP - Connecting database...');

connection
  .authenticate()
  .then(() => {
    console.info('INFO - Database connected.');
  })
  .catch((err) => {
    console.error('ERROR - Unable to connect to the database:', err);
  });

export default connection;
