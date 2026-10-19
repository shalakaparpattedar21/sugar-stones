import { api } from './api';

export function toUiOrder(order) {
  return {
    ...order,
    orderId: order.orderNumber || order.orderId || order._id,
    total: Number(order.totalAmount ?? order.total ?? 0),
    status: order.status || 'Pending',
    createdAt: order.createdAt,
    items: (order.items || []).map(item => ({
      ...item,
      id: item.product?._id || item.product || item.id
    }))
  };
}

export async function createOrder(order) {
  const response = await api.post('/orders', order);
  return toUiOrder(response.data);
}

export async function getMyOrders() {
  const response = await api.get('/orders');
  return response.data.map(toUiOrder);
}

export async function getOrder(id) {
  const response = await api.get(`/orders/${id}`);
  return toUiOrder(response.data);
}
