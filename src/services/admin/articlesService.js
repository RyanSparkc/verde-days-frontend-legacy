import { API_PATH, adminClient, getApiErrorMessage } from './client';

const getNowTimestamp = () => Math.floor(Date.now() / 1000);

const toTimestampSeconds = (dateInput) => {
  if (!dateInput) return getNowTimestamp();
  const timestamp = Math.floor(new Date(dateInput).getTime() / 1000);
  return Number.isFinite(timestamp) ? timestamp : getNowTimestamp();
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

export const parseTagInput = (value) => {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const articleDefaultDraft = {
  title: '',
  description: '',
  content: '',
  image: '',
  tagInput: '',
  createAtDate: '',
  author: 'Verde Days',
  isPublic: true,
};

export const toArticleDraft = (article) => {
  return {
    ...articleDefaultDraft,
    ...(article || {}),
    tagInput: Array.isArray(article?.tag)
      ? article.tag.join(', ')
      : String(article?.tag || ''),
    createAtDate: toDateInputValue(article?.create_at),
    isPublic: article?.isPublic !== false,
  };
};

export const toArticlePayload = (draft) => {
  return {
    title: String(draft?.title || '').trim(),
    description: String(draft?.description || '').trim(),
    content: String(draft?.content || '').trim(),
    image: String(draft?.image || '').trim(),
    tag: parseTagInput(draft?.tagInput),
    create_at: toTimestampSeconds(draft?.createAtDate),
    author: String(draft?.author || '').trim() || 'Verde Days',
    isPublic: Boolean(draft?.isPublic),
  };
};

export async function fetchAdminArticles(page = 1) {
  const { data } = await adminClient.get(`/api/${API_PATH}/admin/articles?page=${page}`);
  if (!data?.success) throw new Error(data?.message || '載入文章失敗');

  return {
    articles: Array.isArray(data.articles) ? data.articles : [],
    pagination: data.pagination || null,
  };
}

export async function fetchAdminArticleById(id) {
  const { data } = await adminClient.get(`/api/${API_PATH}/admin/article/${id}`);
  if (!data?.success || !data?.article) throw new Error(data?.message || '載入文章詳情失敗');
  return data.article;
}

export async function createAdminArticle(draft) {
  const { data } = await adminClient.post(`/api/${API_PATH}/admin/article`, {
    data: toArticlePayload(draft),
  });
  if (!data?.success) throw new Error(data?.message || '建立文章失敗');
  return data;
}

export async function updateAdminArticle(id, draft) {
  const { data } = await adminClient.put(`/api/${API_PATH}/admin/article/${id}`, {
    data: toArticlePayload(draft),
  });
  if (!data?.success) throw new Error(data?.message || '更新文章失敗');
  return data;
}

export async function deleteAdminArticle(id) {
  const { data } = await adminClient.delete(`/api/${API_PATH}/admin/article/${id}`);
  if (!data?.success) throw new Error(data?.message || '刪除文章失敗');
  return data;
}

export function normalizeArticleError(error, fallback = '操作文章失敗') {
  return getApiErrorMessage(error, fallback);
}
