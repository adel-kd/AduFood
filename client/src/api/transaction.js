import axios from './axios.js';

export function initializeTransaction(payload) {
  return axios.post('/transactions', payload);
}
