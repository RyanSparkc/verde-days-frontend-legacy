import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE;
export const API_PATH = import.meta.env.VITE_API_PATH;

export const adminClient = axios.create({
  baseURL: API_BASE,
});

export const getApiErrorMessage = (error, fallback) => {
  const serverMessage = error?.response?.data?.message;
  if (Array.isArray(serverMessage)) return serverMessage.join('、');
  return serverMessage || error?.message || fallback;
};
