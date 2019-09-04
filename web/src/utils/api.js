// tooling modules
import axios from 'axios';

// store
import store from '../store';

// configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  headers: {
    'Content-Type': 'application/json',
  },
});

function listener() {
  const { token } = store.getState().userState;
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}
store.subscribe(listener);

export default api;
