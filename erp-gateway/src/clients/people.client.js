import axios from 'axios';
import env from '../config/env.js';

const peopleClient = axios.create({
  baseURL: env.peopleServiceUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

peopleClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default peopleClient;
