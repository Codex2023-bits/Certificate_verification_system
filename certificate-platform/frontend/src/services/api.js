import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cvp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register  = (data) => API.post('/auth/register', data);
export const login     = (data) => API.post('/auth/login', data);
export const getMe     = ()     => API.get('/auth/me');

// Certificates
export const uploadExcel       = (formData) => API.post('/certificates/upload-excel', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getCertificates   = (params)   => API.get('/certificates', { params });
export const updateCertificate = (id, data) => API.put(`/certificates/${id}`, data);
export const deleteCertificate = (id)       => API.delete(`/certificates/${id}`);
export const verifyCertificate = (certId)   => API.get(`/certificates/verify/${certId}`);
export const getStats          = ()         => API.get('/certificates/stats');
export const getDownloadURL    = (certId)   => `${API.defaults.baseURL}/certificates/download/${certId}`;

export default API;
