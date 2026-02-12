import { articlesSeed } from '@/data/articlesSeed';

const normalizeArticles = (articles) => {
  return [...(Array.isArray(articles) ? articles : [])]
    .filter((article) => article?.isPublic !== false)
    .sort((a, b) => (b?.create_at || 0) - (a?.create_at || 0));
};

export async function listArticles() {
  return normalizeArticles(articlesSeed);
}

export async function getArticleById(id) {
  if (!id) return null;

  return normalizeArticles(articlesSeed).find((article) => article.id === id) || null;
}

export async function listRelatedArticles(article, limit = 3) {
  if (!article) return [];

  const tags = Array.isArray(article.tag) ? article.tag : [];
  if (tags.length === 0) {
    return normalizeArticles(articlesSeed)
      .filter((item) => item.id !== article.id)
      .slice(0, limit);
  }

  return normalizeArticles(articlesSeed)
    .filter((item) => item.id !== article.id)
    .filter((item) => item.tag?.some((tag) => tags.includes(tag)))
    .slice(0, limit);
}
