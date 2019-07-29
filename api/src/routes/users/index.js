import passport from 'passport';
import validators from '../../services/users/validators';

export default {
  // Retorna informações do usuário logado
  'GET /user': {
    path: 'Users.getMe',
    middlewares: [
      passport.authenticate('jwt', { session: false }),
    ],
  },
  // Edita informações do usuário logado
  'PATCH /user': {
    path: 'Users.updateUser',
    middlewares: [
      passport.authenticate('jwt', { session: false }),
      validators.editUser,
    ],
  },
  // Cria um novo usuário
  'POST /user': {
    path: 'Users.post',
    middlewares: [
      validators.createUser,
    ],
  },

  'POST /user/new-address': {
    path: 'Users.registerNewAddress',
    middlewares: [
      passport.authenticate('jwt', { session: false }),
    ],
  },
};
