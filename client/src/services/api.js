// client/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const petsAPI = {
  getAll: (params) => api.get('/pets', { params }),
  getByCategory: (category, params) => api.get(`/pets/category/${category}`, { params }),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post('/pets', data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
  getBreeds: (category) => api.get(`/pets/breeds/${category}`),
};

export const usersAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const sheltersAPI = {
  getAll: () => api.get('/shelters'),
  getById: (id) => api.get(`/shelters/${id}`),
  create: (data) => api.post('/shelters', data),
  update: (id, data) => api.put(`/shelters/${id}`, data),
};

export const breedersAPI = {
  getAll: () => api.get('/breeders'),
  getById: (id) => api.get(`/breeders/${id}`),
  create: (data) => api.post('/breeders', data),
  update: (id, data) => api.put(`/breeders/${id}`, data),
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders/user'),
};

export const paymentsAPI = {
  createSession: (data) => api.post('/payments/create-session', data),
  verifySession: (sessionId) => api.get('/payments/verify', { 
    params: { session_id: sessionId } 
  }),
  getReceipt: (orderId) => api.get(`/payments/receipt?order_id=${encodeURIComponent(orderId)}`),
};

export const articlesAPI = {
  getAll: (category) => api.get('/articles', { params: { category } }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const adoptionAPI = {
  getApplications: () => api.get('/adoptions/user'),
  getApplicationById: (id) => api.get(`/adoptions/${id}`),
  createApplication: (data) => api.post('/adoptions', data),
  checkExistingApplication: (petId) => api.get(`/adoptions/check/${petId}`),
  cancelApplication: (id) => api.put(`/adoptions/${id}/cancel`),
  updateStatus: (id, status, notes) => api.put(`/admin/adoptions/${id}`, { status, admin_notes: notes }),
  getAllApplications: () => api.get('/admin/adoptions')
};

export const adminAPI = {
  getPendingPets: () => api.get('/admin/pets/pending'),
  approvePet: (id) => api.put(`/admin/pets/${id}/approve`),
  rejectPet: (id) => api.put(`/admin/pets/${id}/reject`),
  verifyBreeder: (id) => api.put(`/admin/breeders/${id}/verify`),
};

export const getAnalyticsOverview = async () => {
  return api.get('/admin/analytics/overview');
};

export const getAnalyticsTimeseries = async (metric, range) => {
  return api.get('/admin/analytics/timeseries', {
    params: { metric, range }
  });
};

export const getAnalyticsTopEndpoints = async (limit = 10) => {
  return api.get('/admin/analytics/top-endpoints', {
    params: { limit }
  });
};

export default api;