// Imports
import { body, validationResult } from 'express-validator/check';
import passport from 'passport';
import { query, crypto } from '../utils';

const error = (req, res) => res.status(401).send('Não conseguiu logar');

/**
  * Authenticate normal login page using strategy of authenticate
  */
const login = [
  body('username').exists().isString().not()
    .isEmpty(),
  body('password').exists().isString().not()
    .isEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      res.status(422).json({ errors: errors.array() });
    }
  },
  async (req, res, next) => {
    const { username, password } = req.body;
    const user = await query.users.findByUsername(username);
    if (!user) {
      res.status(401).json({ msg: 'No such user found', username });
    }
    if (crypto.comparePassword(password, user.password)) {
      const { id } = user;
      const token = crypto.createToken({ id });
      res.json({ msg: 'ok', token });
    } else {
      res.status(401).json({ msg: 'User or Password incorrect' });
    }
  },
];


const loginTemp = (req, res) => {
  res.status(200).send('Dá um POST pra cá pra fazer login');
};

const account = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).send(req.user);
  },
];


export default {
  error,
  login,
  loginTemp,
  account,
};
