import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Testimonials from '@/components/home/Testimonials';

const { autoplayFactory, useEmblaCarouselMock } = vi.hoisted(() => ({
  autoplayFactory: vi.fn(() => ({ name: 'autoplay-plugin' })),
  useEmblaCarouselMock: vi.fn(() => [vi.fn(), null]),
}));

vi.mock('embla-carousel-autoplay', () => ({
  default: autoplayFactory,
}));

vi.mock('embla-carousel-react', () => ({
  default: useEmblaCarouselMock,
}));

describe('Testimonials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates autoplay plugin only once across rerenders', () => {
    const { rerender } = render(<Testimonials />);

    rerender(<Testimonials />);

    expect(autoplayFactory).toHaveBeenCalledTimes(1);
  });
});
