import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('axios', () => {
  const get = vi.fn();
  return {
    default: {
      get,
    },
  };
});

const mockApiBase = 'https://example.com';
const mockApiPath = 'verde-days';

const createDeferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv('VITE_API_BASE', mockApiBase);
  vi.stubEnv('VITE_API_PATH', mockApiPath);
});

describe('articleService helpers', () => {
  it('normalizes article shape safely', async () => {
    const { normalizeArticle } = await import('@/services/articleService');

    const item = normalizeArticle({ title: 'A', tag: null, isPublic: true });

    expect(item.title).toBe('A');
    expect(item.tag).toEqual([]);
    expect(item.isPublic).toBe(true);
  });

  it('builds deduped tag set', async () => {
    const { buildTagSet } = await import('@/services/articleService');

    const tags = buildTagSet([{ tag: ['照護', '新手'] }, { tag: ['新手', '送禮'] }]);

    expect(tags).toEqual(['照護', '新手', '送禮']);
  });

  it('filters by tag and paginates', async () => {
    const { filterByTag, paginateArticles, sortByLatest } = await import('@/services/articleService');

    const list = [
      { id: '1', tag: ['A'], create_at: 2 },
      { id: '2', tag: ['B'], create_at: 3 },
      { id: '3', tag: ['A'], create_at: 1 },
    ];

    const filtered = filterByTag(sortByLatest(list), 'A');
    const page = paginateArticles(filtered, 1, 1);

    expect(page.items.map((x) => x.id)).toEqual(['1']);
    expect(page.pagination.total_pages).toBe(2);
  });
});

describe('articleService api', () => {
  it('fetchPublishedArticlesRaw starts page 2 and page 3 requests before awaiting either response', async () => {
    const axios = (await import('axios')).default;
    const page2 = createDeferred();
    const page3 = createDeferred();
    const page1Url = `${mockApiBase}/api/${mockApiPath}/articles?page=1`;
    const page2Url = `${mockApiBase}/api/${mockApiPath}/articles?page=2`;
    const page3Url = `${mockApiBase}/api/${mockApiPath}/articles?page=3`;

    axios.get.mockImplementation((url) => {
      if (url === page1Url) {
        return Promise.resolve({
          data: {
            success: true,
            articles: [{ id: 'a1', title: '第一頁', create_at: 100, tag: ['照護'], isPublic: true }],
            pagination: { total_pages: 3 },
          },
        });
      }

      if (url === page2Url) return page2.promise;
      if (url === page3Url) return page3.promise;
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { fetchPublishedArticlesRaw } = await import('@/services/articleService');
    const pending = fetchPublishedArticlesRaw();

    await Promise.resolve();
    await Promise.resolve();

    try {
      expect(axios.get).toHaveBeenNthCalledWith(1, page1Url);
      expect(axios.get).toHaveBeenNthCalledWith(2, page2Url);
      expect(axios.get).toHaveBeenNthCalledWith(3, page3Url);
    } finally {
      page2.resolve({
        data: {
          success: true,
          articles: [{ id: 'a2', title: '第二頁', create_at: 200, tag: ['照護'], isPublic: true }],
          pagination: { total_pages: 3 },
        },
      });
      page3.resolve({
        data: {
          success: true,
          articles: [{ id: 'a3', title: '第三頁', create_at: 300, tag: ['照護'], isPublic: true }],
          pagination: { total_pages: 3 },
        },
      });
    }

    const result = await pending;
    expect(result.map((item) => item.id)).toEqual(['a3', 'a2', 'a1']);
  });

  it('listArticles returns only published data with pagination and tags', async () => {
    const axios = (await import('axios')).default;
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        articles: [
          {
            id: 'a1',
            title: '公開文章',
            description: 'desc',
            content: 'content',
            image: '/cover.jpg',
            author: 'Verde Days',
            create_at: 200,
            tag: ['照護', '新手'],
            isPublic: true,
          },
          {
            id: 'a2',
            title: '未公開文章',
            create_at: 300,
            tag: ['內部'],
            isPublic: false,
          },
          {
            id: 'a3',
            title: '公開二',
            create_at: 100,
            tag: ['送禮'],
            isPublic: true,
          },
        ],
        pagination: { total_pages: 1 },
      },
    });

    const { listArticles } = await import('@/services/articleService');

    const result = await listArticles({ page: 1, tag: '' });

    expect(result.articles.map((item) => item.id)).toEqual(['a1', 'a3']);
    expect(result.pagination.current_page).toBe(1);
    expect(result.tags).toEqual(['照護', '新手', '送禮']);
    expect(axios.get).toHaveBeenCalledWith(`${mockApiBase}/api/${mockApiPath}/articles?page=1`);
  });

  it('getArticleById returns null when article is not public', async () => {
    const axios = (await import('axios')).default;
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        article: {
          id: 'x1',
          title: 'hidden',
          isPublic: false,
        },
      },
    });

    const { getArticleById } = await import('@/services/articleService');

    const result = await getArticleById('x1');

    expect(result).toBeNull();
    expect(axios.get).toHaveBeenCalledWith(`${mockApiBase}/api/${mockApiPath}/article/x1`);
  });

  it('listRelatedArticles prioritizes shared tags and excludes self', async () => {
    const axios = (await import('axios')).default;
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        articles: [
          { id: 'a1', title: '主文', create_at: 400, tag: ['照護'], isPublic: true },
          { id: 'a2', title: '同標籤', create_at: 300, tag: ['照護'], isPublic: true },
          { id: 'a3', title: '不同標籤', create_at: 200, tag: ['送禮'], isPublic: true },
          { id: 'a4', title: '同標籤2', create_at: 100, tag: ['照護'], isPublic: true },
        ],
        pagination: { total_pages: 1 },
      },
    });

    const { listRelatedArticles } = await import('@/services/articleService');

    const result = await listRelatedArticles({ id: 'a1', tag: ['照護'] }, 2);

    expect(result.map((item) => item.id)).toEqual(['a2', 'a4']);
  });
});
