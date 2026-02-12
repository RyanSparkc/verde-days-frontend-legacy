import { API_PATH, adminClient, getApiErrorMessage } from './client';

export async function fetchAdminOrders(page = 1) {
  const { data } = await adminClient.get(`/api/${API_PATH}/admin/orders?page=${page}`);
  if (!data?.success) throw new Error(data?.message || '載入訂單失敗');

  return {
    orders: Array.isArray(data.orders) ? data.orders : [],
    pagination: data.pagination || null,
  };
}

export async function updateAdminOrder(order) {
  const { data } = await adminClient.put(`/api/${API_PATH}/admin/order/${order.id}`, {
    data: order,
  });
  if (!data?.success) throw new Error(data?.message || '更新訂單失敗');
  return data;
}

export async function deleteAdminOrder(orderId) {
  const { data } = await adminClient.delete(`/api/${API_PATH}/admin/order/${orderId}`);
  if (!data?.success) throw new Error(data?.message || '刪除訂單失敗');
  return data;
}

export function normalizeOrderError(error, fallback) {
  return getApiErrorMessage(error, fallback);
}
