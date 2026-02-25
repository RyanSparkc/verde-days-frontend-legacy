import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('currency formatter', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('creates Intl.NumberFormat once per module load', async () => {
    const numberFormatSpy = vi.spyOn(Intl, 'NumberFormat').mockImplementation(function NumberFormatMock() {
      this.format = (num) => `formatted:${num}`;
    });

    const { currency } = await import('../format.js');

    expect(currency(1000)).toBe('formatted:1000');
    expect(currency(2000)).toBe('formatted:2000');
    expect(numberFormatSpy).toHaveBeenCalledTimes(1);
  });
});
