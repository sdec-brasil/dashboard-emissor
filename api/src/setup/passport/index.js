// Imports
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

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


  /**
   * BearerStrategy
   *
   * This strategy is used to authenticate either users or clients based on an access token
   * (aka a bearer token).  If a user, they must have previously authorized a client
   * application, which is issued an access token to make requests on behalf of
   * the authorizing user.
   *
   * To keep this example simple, restricted scopes are not implemented, and this is just for
   * illustrative purposes
   */
  passport.use(new BearerStrategy((accessToken, done) => {
    query.accessTokens.findByToken(accessToken)
      .then(token => validate.token(token, accessToken))
      .then(token => done(null, token, { scope: '*' }))
      .catch(() => done(null, false));
  }));

  // Register serialialization and deserialization functions.
  //
  // When a client redirects a user to user authorization endpoint, an
  // authorization transaction is initiated.  To complete the transaction, the
  // user must authenticate and approve the authorization request.  Because this
  // may involve multiple HTTPS request/response exchanges, the transaction is
  // stored in the session.
  //
  // An application must supply serialization functions, which determine how the
  // client object is serialized into the session.  Typically this will be a
  // simple matter of serializing the client's ID, and deserializing by finding
  // the client by ID from the database.

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    query.users.findById(id)
      .then(user => done(null, user))
      .catch(err => done(err));
  });
})();
