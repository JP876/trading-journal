import axios from 'axios';

export const baseURL = '/api/v1/';

export const client = (() => {
  const instance = axios.create({ baseURL });
  return instance;
})();
