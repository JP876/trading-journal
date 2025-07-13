import axios from 'axios';

export const baseURL = '/api/';

export const client = (() => {
  const instance = axios.create({ baseURL });
  return instance;
})();
