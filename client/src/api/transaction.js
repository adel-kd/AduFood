import axios from "./axios.js";

// Initialize payment
export function initializeChapaPayment(payload) {
  return axios.post("/payment/initialize", payload);
}

// Manual verify payment
export function manualVerifyPayment(txRef) {
  return axios.get(`/payment/verify/${txRef}`);
}

// Optional alias (if you use this elsewhere)
export function verifyChapaPayment(txRef) {
  return axios.get(`/payment/verify/${txRef}`);
}