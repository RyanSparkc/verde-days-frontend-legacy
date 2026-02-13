import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminArticles from '@/pages/admin/AdminArticles';
import {
  fetchAdminArticleById,
  fetchAdminArticles,
  updateAdminArticle,
} from '@/services/admin/articlesService';

vi.mock('@/services/admin/articlesService', async () => {
  const actual = await vi.importActual('@/services/admin/articlesService');
  return {
    ...actual,
    fetchAdminArticles: vi.fn(),
    fetchAdminArticleById: vi.fn(),
    updateAdminArticle: vi.fn(),
    createAdminArticle: vi.fn(),
    deleteAdminArticle: vi.fn(),
  };
});

vi.mock('@/services/admin/productsService', () => ({
  uploadAdminImage: vi.fn(),
}));

const basePagination = {
  current_page: 1,
  total_pages: 1,
  has_pre: false,
  has_next: false,
};

describe('AdminArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchAdminArticles.mockResolvedValue({
      articles: [],
      pagination: basePagination,
    });
  });

  it('renders editorial workspace heading', async () => {
    render(
      <MemoryRouter>
        <AdminArticles />
      </MemoryRouter>,
    );

    expect(screen.getByText('內容編輯工作台')).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchAdminArticles).toHaveBeenCalledWith(1);
    });
  });

  it('fetches full article before toggling publish status', async () => {
    const user = userEvent.setup();

    fetchAdminArticles.mockResolvedValue({
      articles: [
        {
          id: 'a1',
          title: '測試文章',
          description: '摘要',
          create_at: 1700000000,
          author: 'Verde Days',
          image: '',
          isPublic: true,
          tag: ['照護'],
        },
      ],
      pagination: basePagination,
    });

    fetchAdminArticleById.mockResolvedValue({
      id: 'a1',
      title: '測試文章',
      description: '摘要',
      content: '完整內容',
      create_at: 1700000000,
      author: 'Verde Days',
      image: '',
      isPublic: true,
      tag: ['照護'],
    });

    updateAdminArticle.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <AdminArticles />
      </MemoryRouter>,
    );

    expect((await screen.findAllByText('測試文章')).length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole('button', { name: '已公開' })[0]);

    await waitFor(() => {
      expect(fetchAdminArticleById).toHaveBeenCalledWith('a1');
    });

    await waitFor(() => {
      expect(updateAdminArticle).toHaveBeenCalledWith(
        'a1',
        expect.objectContaining({
          content: '完整內容',
          isPublic: false,
        }),
      );
    });

    expect(fetchAdminArticles).toHaveBeenCalledTimes(1);
  });
});
