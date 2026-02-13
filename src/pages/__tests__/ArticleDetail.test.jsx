import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArticleDetail from '@/pages/ArticleDetail';
import { getArticleById, listRelatedArticles } from '@/services/articleService';

vi.mock('@/services/articleService', () => ({
  getArticleById: vi.fn(),
  listRelatedArticles: vi.fn(),
}));

vi.mock('@/slice/catalogReducer', () => ({
  fetchProductsAllIfNeeded: vi.fn(() => ({ type: 'catalog/fetchProductsAllIfNeeded' })),
}));

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: (selector) =>
    selector({
      catalog: {
        productsAll: [],
        isProductsLoading: false,
      },
    }),
}));

describe('ArticleDetail page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows branded not found when article is missing', async () => {
    getArticleById.mockResolvedValue(null);
    listRelatedArticles.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/article/not-found']}>
        <Routes>
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('找不到這篇文章')).toBeInTheDocument();
  });

  it('keeps main article visible when related request fails', async () => {
    getArticleById.mockResolvedValue({
      id: 'a1',
      title: '室內植物換盆指南',
      description: 'desc',
      content: '段落一\n\n段落二',
      create_at: 1700000000,
      image: '/cover.jpg',
      tag: ['照護'],
      isPublic: true,
    });
    listRelatedArticles.mockRejectedValue(new Error('related error'));

    render(
      <MemoryRouter initialEntries={['/article/a1']}>
        <Routes>
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('室內植物換盆指南')).toBeInTheDocument();
    expect(screen.queryByText('載入文章失敗，請稍後再試。')).not.toBeInTheDocument();
  });
});
