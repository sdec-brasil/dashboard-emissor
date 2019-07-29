// Imports
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import passportJWT from 'passport-jwt';
import setupPassport from './passport';
import sequelizeConnection from './databaseConnection';


// App Imports
import { accessTokens } from '../utils/db';
import { db, sessions } from '../config/config';

// Session Sequelize
const SessionStore = require('express-session-sequelize')(session.Store);

// Load express modules
export default function (server) {
  console.info('SETUP - Loading modules...');

  // Enable CORS
  server.use(cors());
  server.set('views', path.join(__dirname, '../public/views'));
  server.set('view engine', 'ejs');

  // Request body parser
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Request body cookie parser
  server.use(cookieParser());

  // Use Sequelize to Store Sessions
  const sequelizeSessionStore = new SessionStore({
    db: sequelizeConnection,
  });

  // Use sessions as middleware
  server.use(session({
    saveUninitialized: true,
    resave: true,
    secret: sessions.secret,
    key: 'authorization.sid',
    cookie: { maxAge: sessions.maxAge },
    store: sequelizeSessionStore,
  }));


  // Use Passport
  server.use(passport.initialize());
  server.use(passport.session());

  // HTTP logger
  if (process.env.NODE_ENV !== 'test') server.use(morgan('tiny'));

  // From time to time we need to clean up any expired tokens
  // in the database
  if (process.env.NODE_ENV !== 'test') {
    setInterval(() => {
      accessTokens.removeExpired()
        .catch(err => console.error('Error trying to remove expired tokens:', err.stack));
    }, db.timeToCheckExpiredTokens * 1000);
  }
}
