import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8081',
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

export const getAllMenuItems = (pageNo = 1, pageSize = 6, sortBy = 'id', sortDir = 'asc') => api.get('/api/menu', { params: { pageNo, pageSize, sortBy, sortDir } });

export const getMenuItemById = (id) => api.get(`/api/menu/id/${id}`);

export const createMenuItem = (data) => api.post(`/api/menu/create`, data)

export const updateMenuItem = (id, data) => api.put(`/api/menu/update/${id}`, data);

export const deleteMenuItem = (id) => api.delete(`/api/menu/delete/${id}`);

export const searchMenuItems = (keyword) => api.get(`/api/menu/search`, { params: { keyword } });

export default api;