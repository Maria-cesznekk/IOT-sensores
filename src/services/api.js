import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.137.11.6/api',
});

export default api;