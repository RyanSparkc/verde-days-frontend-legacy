import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import AdminCoupons from '@/pages/admin/AdminCoupons';

describe('AdminCoupons', () => {
  it('renders coupon management heading', () => {
    render(
      <MemoryRouter>
        <AdminCoupons />
      </MemoryRouter>,
    );

    expect(screen.getByText('優惠券管理')).toBeInTheDocument();
  });
});
