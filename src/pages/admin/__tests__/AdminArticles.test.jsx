import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import AdminArticles from '@/pages/admin/AdminArticles';

describe('AdminArticles', () => {
  it('renders article management heading', () => {
    render(
      <MemoryRouter>
        <AdminArticles />
      </MemoryRouter>,
    );

    expect(screen.getByText('文章管理')).toBeInTheDocument();
  });
});
