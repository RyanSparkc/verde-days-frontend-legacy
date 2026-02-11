# 商品列表頁設計

> 日期：2026-02-11

## 頁面概覽

前台核心電商頁面 `/products`，顯示所有商品並支援分類篩選。首頁多處 CTA 連結至此頁（HeroSection、FeaturedProducts、CategorySection、PlantQuizGuide、CTASection、Footer）。

## 資料策略

採用 **client-side 全量篩選**，而非 server-side 分頁：

- API：`GET /v2/api/{API_PATH}/products/all` — 一次拉全部商品（26 筆）
- 篩選：前端根據 URL `?category=` 參數 filter
- 排序：按分類權重排列（觀葉 → 多肉 → 空鳳 → 禮盒 → 配件）
- 不使用分頁：資料量小，一頁顯示完畢

### 為何不用分頁 API

`GET /products?page=X` 每頁固定 10 筆，26 筆會產生 3 頁分頁。對使用者來說切換分頁體驗不佳，且每次切分類/翻頁都要重新請求 API。改為一次全拉後，分類切換瞬間完成、零網路延遲。

## 頁面結構

```
┌─────────────────────────────────────────────┐
│ Page Header（英文分類名 + 中文標題 + 數量）  │
├─────────────────────────────────────────────┤
│ [全部] [觀葉] [多肉] [空鳳] [禮盒] [配件]   │
├─────────────────────────────────────────────┤
│ 商品 Grid（2 欄 / 3 欄 / 4 欄 RWD）         │
│ 使用共用 ProductCard 元件                    │
└─────────────────────────────────────────────┘
```

## 新增檔案

| 檔案 | 用途 |
|---|---|
| `src/components/common/ProductCard.jsx` | 共用商品卡片（從 FeaturedProducts 提取） |
| `src/components/common/Pagination.jsx` | 共用分頁元件（Products 頁未使用，保留給後台） |
| `src/pages/Products.jsx` | 商品列表頁 |

## 修改檔案

| 檔案 | 變更 |
|---|---|
| `src/components/home/FeaturedProducts.jsx` | 移除內部 ProductCard，改 import 共用版 |
| `src/router.jsx` | 掛載 Products 實際元件 |

## 設計決策

### URL-driven state

分類狀態由 `useSearchParams` 驅動，讓首頁 CTA（如 `/products?category=foliage`）能自然帶入篩選條件，也支援使用者分享/收藏特定分類頁面。

### 分類權重排序

API 回傳順序將配件排在前面、觀葉排在後面，不符合使用者期待。前端用 `categoryOrder` 權重表重新排序：

```js
const categoryOrder = {
  foliage: 0,    // 觀葉植物（主力）
  succulent: 1,  // 多肉植物
  airplant: 2,   // 空氣鳳梨
  giftset: 3,    // 植栽禮盒
  accessories: 4, // 盆器配件
};
```

### 動畫

延續首頁莫蘭迪動畫語言：
- 統一 easing：`[0.22, 1, 0.36, 1]`
- Page header / Tabs：fade-up 進場
- 商品卡片：`whileInView` + stagger（`delay: index * 0.05`）
- 分類切換：`AnimatePresence mode="wait"` fade 過渡
- 載入中：skeleton 骨架屏 + `animate-pulse`

## 分類定義

```js
const categories = [
  { key: '', label: '全部', en: 'All' },
  { key: 'foliage', label: '觀葉植物', en: 'Foliage' },
  { key: 'succulent', label: '多肉植物', en: 'Succulent' },
  { key: 'airplant', label: '空氣鳳梨', en: 'Air Plant' },
  { key: 'giftset', label: '植栽禮盒', en: 'Gift Set' },
  { key: 'accessories', label: '盆器配件', en: 'Accessories' },
];
```
