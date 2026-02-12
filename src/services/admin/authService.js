import { API_PATH, adminClient, getApiErrorMessage } from './client';
import { applyAdminToken, clearAdminToken, getAdminToken, setAdminToken } from './session';

export async function signInAdmin({ username, password }) {
  const { data } = await adminClient.post('/admin/signin', { username, password });
  if (!data?.success || !data?.token) {
    throw new Error(data?.message || '登入失敗');
  }

  setAdminToken({ token: data.token, expired: data.expired });
  applyAdminToken(data.token);
  return data;
}

export async function checkAdminSession() {
  const token = getAdminToken();
  if (!token) {
    throw new Error('未登入');
  }

  applyAdminToken(token);

  try {
    const { data } = await adminClient.post('/api/user/check');
    if (!data?.success) throw new Error(data?.message || '登入驗證失敗');
    return data;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404 || status === 400) {
      const { data } = await adminClient.post(`/api/${API_PATH}/user/check`);
      if (!data?.success) throw new Error(data?.message || '登入驗證失敗');
      return data;
    }
    throw error;
  }
}

export async function logoutAdmin() {
  try {
    await adminClient.post('/logout');
  } finally {
    clearAdminToken();
    applyAdminToken('');
  }
}

export function normalizeAuthError(error, fallback = '操作失敗') {
  return getApiErrorMessage(error, fallback);
}
