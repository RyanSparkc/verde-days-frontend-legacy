import { API_PATH, adminClient, getApiErrorMessage } from './client';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toTimestampSeconds = (value) => {
  if (!value) return Math.floor(Date.now() / 1000);
  const timestamp = Math.floor(new Date(value).getTime() / 1000);
  return Number.isFinite(timestamp) ? timestamp : Math.floor(Date.now() / 1000);
};

export const toDateInputValue = (seconds) => {
  if (!seconds) return '';
  const date = new Date(Number(seconds) * 1000);
  if (Number.isNaN(date.getTime())) return '';

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const couponDefaultDraft = {
  title: '',
  code: '',
  percent: 100,
  dueDate: '',
  is_enabled: 1,
};

export const toCouponDraft = (coupon) => {
  return {
    ...couponDefaultDraft,
    ...(coupon || {}),
    code: String(coupon?.code || '').toUpperCase(),
    percent: toNumber(coupon?.percent, 100),
    dueDate: toDateInputValue(coupon?.due_date),
    is_enabled: coupon?.is_enabled ? 1 : 0,
  };
};

export const toCouponPayload = (draft) => {
  return {
    title: String(draft?.title || '').trim(),
    code: String(draft?.code || '').trim().toUpperCase(),
    percent: toNumber(draft?.percent, 100),
    due_date: toTimestampSeconds(draft?.dueDate),
    is_enabled: draft?.is_enabled ? 1 : 0,
  };
};

export async function fetchAdminCoupons(page = 1) {
  const { data } = await adminClient.get(`/api/${API_PATH}/admin/coupons?page=${page}`);
  if (!data?.success) throw new Error(data?.message || '載入優惠券失敗');

  return {
    coupons: Array.isArray(data.coupons) ? data.coupons : [],
    pagination: data.pagination || null,
  };
}

export async function createAdminCoupon(draft) {
  const { data } = await adminClient.post(`/api/${API_PATH}/admin/coupon`, {
    data: toCouponPayload(draft),
  });
  if (!data?.success) throw new Error(data?.message || '新增優惠券失敗');
  return data;
}

export async function updateAdminCoupon(id, draft) {
  const { data } = await adminClient.put(`/api/${API_PATH}/admin/coupon/${id}`, {
    data: toCouponPayload(draft),
  });
  if (!data?.success) throw new Error(data?.message || '更新優惠券失敗');
  return data;
}

export async function deleteAdminCoupon(id) {
  const { data } = await adminClient.delete(`/api/${API_PATH}/admin/coupon/${id}`);
  if (!data?.success) throw new Error(data?.message || '刪除優惠券失敗');
  return data;
}

export function normalizeCouponError(error, fallback = '操作優惠券失敗') {
  return getApiErrorMessage(error, fallback);
}
