import { describe, expect, it } from 'vitest';
import { parseTagInput, toArticlePayload } from '@/services/admin/articlesService';

describe('articlesService mapping', () => {
  it('normalizes tag input', () => {
    expect(parseTagInput('照護, 新手, 送禮')).toEqual(['照護', '新手', '送禮']);
  });

  it('maps draft payload for API', () => {
    const payload = toArticlePayload({
      title: 'A',
      tagInput: '照護, 送禮',
      createAtDate: '2026-02-12',
      isPublic: true,
    });

    expect(Array.isArray(payload.tag)).toBe(true);
    expect(typeof payload.create_at).toBe('number');
    expect(payload.isPublic).toBe(true);
  });
});
