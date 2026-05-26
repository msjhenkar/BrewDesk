import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

// POST /user/register
// body: { firstName, lastName, email, password, phone }
export const registerUser = (data) => api.post('/user/register', data);

// POST /user/login
// body: { email, password }
export const loginUser = (data) => api.post('/user/login', data);
