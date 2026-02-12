import { describe, expect, it } from 'vitest';
import { toCouponDraft, toCouponPayload } from '@/services/admin/couponsService';

describe('couponsService mapping', () => {
  it('maps API coupon to editable draft', () => {
    const draft = toCouponDraft({
      title: 'Test',
      code: 'OFF10',
      percent: 90,
      due_date: 1750000000,
      is_enabled: 1,
    });

    expect(draft.code).toBe('OFF10');
    expect(draft.is_enabled).toBe(1);
    expect(draft.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('maps draft to API payload', () => {
    const payload = toCouponPayload({
      title: 'A',
      code: 'off20',
      percent: '80',
      dueDate: '2026-05-10',
      is_enabled: 1,
    });

    expect(payload.code).toBe('OFF20');
    expect(payload.percent).toBe(80);
    expect(typeof payload.due_date).toBe('number');
  });
});
