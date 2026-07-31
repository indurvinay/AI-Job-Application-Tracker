import axios from 'axios';

// Create a central "instance" of axios pointing to our Express server
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// This "interceptor" runs right before EVERY single request leaves our frontend.
// It checks if we have a token saved, and if we do, it attaches it as our "ID Badge"
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
