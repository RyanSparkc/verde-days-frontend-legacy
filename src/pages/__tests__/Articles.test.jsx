import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Articles from '@/pages/Articles';
import { listArticles } from '@/services/articleService';

vi.mock('@/services/articleService', () => ({
  listArticles: vi.fn(),
}));

describe('Articles page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders article from api payload', async () => {
    listArticles.mockResolvedValue({
      articles: [
        {
          id: 'a1',
          title: 'T1',
          description: 'D1',
          create_at: 1700000000,
          image: '/x.jpg',
          tag: ['照護'],
        },
      ],
      pagination: {
        total_pages: 1,
        current_page: 1,
        has_pre: false,
        has_next: false,
      },
      tags: ['照護'],
    });

    render(
      <MemoryRouter initialEntries={['/articles?page=1']}>
        <Routes>
          <Route path="/articles" element={<Articles />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('T1')).toBeInTheDocument();
    expect(screen.getByText('植物日誌')).toBeInTheDocument();
    expect(listArticles).toHaveBeenCalledWith({ page: 1, tag: '' });
  });

  it('changes query when tag is selected', async () => {
    const user = userEvent.setup();

    listArticles
      .mockResolvedValueOnce({
        articles: [
          {
            id: 'a1',
            title: 'T1',
            description: 'D1',
            create_at: 1700000000,
            image: '/x.jpg',
            tag: ['照護'],
          },
        ],
        pagination: {
          total_pages: 2,
          current_page: 2,
          has_pre: true,
          has_next: false,
        },
        tags: ['照護'],
      })
      .mockResolvedValueOnce({
        articles: [
          {
            id: 'a1',
            title: 'T1',
            description: 'D1',
            create_at: 1700000000,
            image: '/x.jpg',
            tag: ['照護'],
          },
        ],
        pagination: {
          total_pages: 1,
          current_page: 1,
          has_pre: false,
          has_next: false,
        },
        tags: ['照護'],
      });

    render(
      <MemoryRouter initialEntries={['/articles?page=2']}>
        <Routes>
          <Route path="/articles" element={<Articles />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('button', { name: '#照護' })).toBeInTheDocument();
    await screen.findByText('T1');
    await user.click(screen.getByRole('button', { name: '#照護' }));

    await waitFor(() => {
      expect(listArticles).toHaveBeenLastCalledWith({ page: 1, tag: '照護' });
    });
  });
});
