// tooling modules
import axios from 'axios';
import { BACKEND_URL } from './settings';

// configuration
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
