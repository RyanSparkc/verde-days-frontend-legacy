import { describe, expect, it, vi } from 'vitest';
import { fetchArticlesIfNeeded } from '@/slice/catalogReducer';
import { listArticles } from '@/services/articleService';

vi.mock('@/services/articleService', () => ({
  listArticles: vi.fn(),
}));

describe('catalogReducer article thunk', () => {
  it('stores normalized article list payload for home preview', async () => {
    listArticles.mockResolvedValue({
      articles: [{ id: 'a1', title: '文章一' }],
      pagination: {
        total_pages: 1,
        current_page: 1,
        has_pre: false,
        has_next: false,
      },
      tags: ['照護'],
    });

    const dispatch = vi.fn();
    const getState = () => ({
      catalog: {
        productsAll: [],
        productsFetchedAt: null,
        isProductsLoading: false,
        articlesList: [],
        articlesFetchedAt: null,
        isArticlesLoading: false,
      },
    });

    await fetchArticlesIfNeeded()(
      dispatch,
      getState,
      undefined,
    );

    const setListAction = dispatch.mock.calls.find(([action]) => action.type === 'catalog/setArticlesList')?.[0];

    expect(setListAction.payload).toEqual([{ id: 'a1', title: '文章一' }]);
  });
});
