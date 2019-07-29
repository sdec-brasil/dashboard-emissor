// Imports
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { jwtOptions } from '../../config/config';

// App Imports
import { query, validate } from '../../utils';

export default (() => {
  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a username and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */
  passport.use(new LocalStrategy(
    (username, password, done) => {
      query.users.findByUsername(username)
        .then(user => validate.user(user, password))
        .then(user => done(null, user))
        .catch(() => done(null, false));
    },
  ));


  // JwtStrategy for Authorization: Bearer header.
  const JwtStrategy = passportJWT.Strategy;
  passport.use(new JwtStrategy(jwtOptions, (async (jwtPayload, next) => {
    const user = await query.users.findById(jwtPayload.id);
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  })));
})();
