// tooling modules
import Cookies from 'universal-cookie';
import store from '../store';
import api from './api';

import { setToken, setUser } from '../reducers/userState';

const cookies = new Cookies();

export const login = ({ username, password }) => api.post('/login', { username, password })
  .then((response) => {
    // logged in!
    const { token } = response.data;
    store.dispatch(setToken(token));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    cookies.set('token', token);

    // get user info
    return api.get('/v1/user').then((userInfo) => {
      store.dispatch(setUser(userInfo));
    });
  });

export const register = ({ username, password, name }) => api.post('/v1/user', { username, password, name })
  .then(() => login({ username, password }));
