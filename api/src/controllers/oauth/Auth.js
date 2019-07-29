// Imports
import Login from 'connect-ensure-login';
import passport from 'passport';
import { query, crypto } from '../../utils';

const error = (req, res) => res.status(401).send('Não conseguiu logar');

/**
  * Authenticate normal login page using strategy of authenticate
  */
const login = [
  // passport.authenticate('local', {
  //   successReturnToOrRedirect: '/',
  //   failureRedirect: '/error',
  // }),
  async (req, res, next) => {
    const { username, password } = req.body;
    if (username && password) {
      // we get the user with the name and save the resolved promise
      const user = await query.users.findByUsername(username);
      if (!user) {
        res.status(401).json({ msg: 'No such user found', username });
      }
      if (crypto.comparePassword(password, user.password)) {
        // from now on we’ll identify the user by the id and the id is
        // the only personalized value that goes into our token
        const { id } = user;
        const token = crypto.createToken({ id });
        res.json({ msg: 'ok', token });
      } else {
        res.status(401).json({ msg: 'User or Password incorrect' });
      }
    }
  },
];

/**
   * Logout of the system and redirect to root
   * @param   {Object}   req - The request
   * @param   {Object}   res - The response
   * @returns {undefined}
   */
const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

const loginTemp = (req, res) => {
  res.status(200).send('Dá um POST pra cá pra fazer login');
};

const account = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).send(req.user);
  },
];

const loginPage = (req, res) => {
  res.render('login');
};

export default {
  error,
  login,
  logout,
  loginTemp,
  account,
  loginPage,
};
