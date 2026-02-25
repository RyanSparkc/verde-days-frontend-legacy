import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export const ARTICLE_PAGE_SIZE = 6;

export const normalizeArticle = (item) => {
  const rawTag = item?.tag;
  const parsedTag = Array.isArray(rawTag)
    ? rawTag
    : String(rawTag || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

  return {
    id: String(item?.id || ''),
    title: String(item?.title || ''),
    description: String(item?.description || ''),
    content: String(item?.content || ''),
    author: String(item?.author || 'Verde Days'),
    create_at: Number(item?.create_at || 0),
    image: String(item?.image || ''),
    tag: parsedTag.filter(Boolean),
    isPublic: item?.isPublic !== false,
  };
};

export const sortByLatest = (list) => {
  return [...(Array.isArray(list) ? list : [])].sort((a, b) => (b?.create_at || 0) - (a?.create_at || 0));
};

export const filterByTag = (list, tag) => {
  const normalizedTag = String(tag || '').trim();
  if (!normalizedTag) return [...(Array.isArray(list) ? list : [])];
  return (Array.isArray(list) ? list : []).filter((item) => item?.tag?.includes(normalizedTag));
};

export const buildTagSet = (list) => {
  const set = new Set();
  (Array.isArray(list) ? list : []).forEach((item) => {
    (Array.isArray(item?.tag) ? item.tag : []).forEach((tag) => {
      if (tag) set.add(tag);
    });
  });
  return [...set];
};

export const paginateArticles = (list, page = 1, pageSize = ARTICLE_PAGE_SIZE) => {
  const safeSize = Math.max(1, Number(pageSize) || ARTICLE_PAGE_SIZE);
  const total = Array.isArray(list) ? list.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * safeSize;
  const items = (Array.isArray(list) ? list : []).slice(start, start + safeSize);

  return {
    items,
    pagination: {
      total_pages: totalPages,
      current_page: current,
      has_pre: current > 1,
      has_next: current < totalPages,
    },
  };
};

const toError = (message, fallback) => new Error(message || fallback);

const fetchArticlesPage = async (page) => {
  const { data } = await axios.get(`${API_BASE}/api/${API_PATH}/articles?page=${page}`);
  if (!data?.success) {
    throw toError(data?.message, '載入文章失敗');
  }

  return {
    items: Array.isArray(data.articles) ? data.articles : [],
    totalPages: Math.max(1, Number(data?.pagination?.total_pages) || 1),
  };
};

export async function fetchPublishedArticlesRaw() {
  const collection = [];
  const firstPage = await fetchArticlesPage(1);

  collection.push(...firstPage.items);

  const remainingPages = Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) => index + 2);
  const responses = await Promise.all(remainingPages.map((page) => fetchArticlesPage(page)));

  responses.forEach((response) => {
    collection.push(...response.items);
  });

  return sortByLatest(
    collection
      .map(normalizeArticle)
      .filter((article) => article.id && article.isPublic),
  );
}

export async function listArticles({ page = 1, tag = '', pageSize = ARTICLE_PAGE_SIZE } = {}) {
  const allArticles = await fetchPublishedArticlesRaw();
  const filtered = filterByTag(allArticles, tag);
  const paged = paginateArticles(filtered, page, pageSize);

  return {
    articles: paged.items,
    pagination: paged.pagination,
    tags: buildTagSet(allArticles),
  };
}

export async function getArticleById(id) {
  if (!id) return null;

  try {
    const { data } = await axios.get(`${API_BASE}/api/${API_PATH}/article/${id}`);
    if (!data?.success || !data.article) return null;

    const normalized = normalizeArticle(data.article);
    if (!normalized.id || !normalized.isPublic) return null;

    return normalized;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw toError(error?.response?.data?.message, '載入文章詳情失敗');
  }
}

export async function listRelatedArticles(article, limit = 3) {
  if (!article) return [];

  const safeLimit = Math.max(0, Number(limit) || 0);
  if (safeLimit === 0) return [];

  const allArticles = await fetchPublishedArticlesRaw();
  const candidates = allArticles.filter((item) => item.id !== String(article.id || ''));

  const tags = Array.isArray(article?.tag) ? article.tag : [];
  if (tags.length === 0) {
    return candidates.slice(0, safeLimit);
  }

  const withSharedTag = candidates.filter((item) => item.tag.some((tag) => tags.includes(tag)));
  const withoutSharedTag = candidates.filter((item) => !item.tag.some((tag) => tags.includes(tag)));

  return [...withSharedTag, ...withoutSharedTag].slice(0, safeLimit);
}
