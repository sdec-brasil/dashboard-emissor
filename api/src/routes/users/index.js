import login from 'connect-ensure-login';

export default {
  // Retorna informações do usuário logado
  'GET /user': {
    path: 'Users.getMe',
    middlewares: [
      login.ensureLoggedIn(),
    ],
  },
  // Edita informações do usuário logado
  'PATCH /user': {
    path: 'Users.updateUser',
    middlewares: [
      login.ensureLoggedIn(),
    ],
  },
  // Cria um novo usuário
  'POST /user': {
    path: 'Users.post',
    middlewares: [
    ],
  },
};
