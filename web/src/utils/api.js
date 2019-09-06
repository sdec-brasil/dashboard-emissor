// tooling modules
import axios from 'axios';

// configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
