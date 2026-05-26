import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

// POST /api/orders — place order
// body: { userId, menuItems: [{ menuItemId, quantity }] }
export const placeOrder = (data) => api.post('/api/orders', data);

// GET /api/orders — all orders (admin)
export const getAllOrders = () => api.get('/api/orders');

// GET /api/orders/:id — one order
export const getOrderById = (id) => api.get(`/api/orders/${id}`);

// PATCH /api/orders/:id/status?status=CONFIRMED
export const updateOrderStatus = (id, status) =>
  api.patch(`/api/orders/${id}/status`, null, { params: { status } });

// DELETE /api/orders/:id
export const deleteOrder = (id) => api.delete(`/api/orders/${id}`);
