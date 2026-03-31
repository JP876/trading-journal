import axios from 'axios';

export const baseURL = '/api/v1/';

export const axiosInstance = (() => {
  const instance = axios.create({ baseURL });
  return instance;
})();
