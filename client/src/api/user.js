import api from './axios';

// Address management
export const getUserAddresses = () => api.get('/user/addresses');
export const addAddress = (data) => api.post('/user/addresses', data);
export const updateAddress = (id, data) => api.put(`/user/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/user/addresses/${id}`);
export const setDefaultAddress = (id) => api.patch(`/user/addresses/${id}/default`);

// User profile
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);