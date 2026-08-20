import api from './api';

export const placeOrder = (data) => api.post('/api/orders', data);

export const getAllOrders = () => api.get('/api/orders');

// GET /api/orders/:id — one order
export const getOrderById = (id) => api.get(`/api/orders/${id}`);

// PATCH /api/orders/:id/status?status=CONFIRMED
export const updateOrderStatus = (id, status) =>
  api.patch(`/api/orders/${id}/status`, null, { params: { status } });

// DELETE /api/orders/:id
export const deleteOrder = (id) => api.delete(`/api/orders/${id}`);
