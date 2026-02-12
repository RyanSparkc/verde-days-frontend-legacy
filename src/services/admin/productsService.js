import { API_PATH, adminClient, getApiErrorMessage } from './client';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const productDefaultDraft = {
  title: '',
  category: 'foliage',
  unit: '盆',
  origin_price: 0,
  price: 0,
  description: '',
  content: '',
  is_enabled: 0,
  imageUrl: '',
  imagesUrl: [],
  careLevel: 'easy',
  light: 'medium',
  water: '',
  petFriendly: false,
  size: 'M',
  height: '',
  origin: '',
};

export const toProductDraft = (product) => {
  return {
    ...productDefaultDraft,
    ...(product || {}),
    origin_price: toNumber(product?.origin_price),
    price: toNumber(product?.price),
    is_enabled: product?.is_enabled ? 1 : 0,
    imagesUrl: Array.isArray(product?.imagesUrl) ? product.imagesUrl : [],
    petFriendly: Boolean(product?.petFriendly),
  };
};

export const toProductPayload = (draft) => {
  return {
    ...draft,
    origin_price: toNumber(draft.origin_price),
    price: toNumber(draft.price),
    is_enabled: draft.is_enabled ? 1 : 0,
    imagesUrl: Array.isArray(draft.imagesUrl)
      ? draft.imagesUrl.map((url) => url.trim()).filter(Boolean)
      : [],
    petFriendly: Boolean(draft.petFriendly),
  };
};

export async function fetchAdminProducts(page = 1) {
  const { data } = await adminClient.get(`/api/${API_PATH}/admin/products?page=${page}`);
  if (!data?.success) throw new Error(data?.message || '載入商品失敗');

  return {
    products: Array.isArray(data.products) ? data.products : [],
    pagination: data.pagination || null,
  };
}

export async function createAdminProduct(draft) {
  const { data } = await adminClient.post(`/api/${API_PATH}/admin/product`, {
    data: toProductPayload(draft),
  });
  if (!data?.success) throw new Error(data?.message || '建立商品失敗');
  return data;
}

export async function updateAdminProduct(id, draft) {
  const { data } = await adminClient.put(`/api/${API_PATH}/admin/product/${id}`, {
    data: toProductPayload(draft),
  });
  if (!data?.success) throw new Error(data?.message || '更新商品失敗');
  return data;
}

export async function deleteAdminProduct(id) {
  const { data } = await adminClient.delete(`/api/${API_PATH}/admin/product/${id}`);
  if (!data?.success) throw new Error(data?.message || '刪除商品失敗');
  return data;
}

export async function uploadAdminImage(file) {
  const formData = new FormData();
  formData.append('file-to-upload', file);

  const { data } = await adminClient.post(`/api/${API_PATH}/admin/upload`, formData);
  if (!data?.success || !data?.imageUrl) {
    throw new Error(data?.message || '圖片上傳失敗');
  }

  return data.imageUrl;
}

export function normalizeProductError(error, fallback) {
  return getApiErrorMessage(error, fallback);
}
