import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toProductList } from '@/utils/api';
import { listArticles } from '@/services/articleService';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const CACHE_TTL_MS = 10 * 60 * 1000;

const isFresh = (fetchedAt) =>
  typeof fetchedAt === 'number' && Date.now() - fetchedAt < CACHE_TTL_MS;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const initialState = {
  productsAll: [],
  productsFetchedAt: null,
  isProductsLoading: false,
  articlesList: [],
  articlesFetchedAt: null,
  isArticlesLoading: false,
};

export const fetchProductsAllIfNeeded = createAsyncThunk(
  'catalog/fetchProductsAllIfNeeded',
  async ({ force = false } = {}, { getState, dispatch, rejectWithValue }) => {
    const { catalog } = getState();

    if (!force) {
      if (isFresh(catalog.productsFetchedAt)) {
        return catalog.productsAll;
      }
      if (catalog.isProductsLoading) {
        return catalog.productsAll;
      }
    }

    dispatch(setProductsLoading(true));
    try {
      const { data } = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
      if (!data.success) {
        throw new Error('載入商品失敗');
      }

      const list = toProductList(data.products).filter((product) => product.is_enabled);
      dispatch(setProductsAll(list));
      dispatch(setProductsFetchedAt(Date.now()));
      return list;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, '載入商品失敗'));
    } finally {
      dispatch(setProductsLoading(false));
    }
  },
);

export const fetchArticlesIfNeeded = createAsyncThunk(
  'catalog/fetchArticlesIfNeeded',
  async ({ force = false } = {}, { getState, dispatch, rejectWithValue }) => {
    const { catalog } = getState();

    if (!force) {
      if (isFresh(catalog.articlesFetchedAt)) {
        return catalog.articlesList;
      }
      if (catalog.isArticlesLoading) {
        return catalog.articlesList;
      }
    }

    dispatch(setArticlesLoading(true));
    try {
      const list = await listArticles();
      dispatch(setArticlesList(list));
      dispatch(setArticlesFetchedAt(Date.now()));
      return list;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, '載入文章失敗'));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  },
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setProductsAll(state, action) {
      state.productsAll = action.payload;
    },
    setProductsFetchedAt(state, action) {
      state.productsFetchedAt = action.payload;
    },
    setProductsLoading(state, action) {
      state.isProductsLoading = action.payload;
    },
    setArticlesList(state, action) {
      state.articlesList = action.payload;
    },
    setArticlesFetchedAt(state, action) {
      state.articlesFetchedAt = action.payload;
    },
    setArticlesLoading(state, action) {
      state.isArticlesLoading = action.payload;
    },
  },
});

export const {
  setProductsAll,
  setProductsFetchedAt,
  setProductsLoading,
  setArticlesList,
  setArticlesFetchedAt,
  setArticlesLoading,
} = catalogSlice.actions;

export default catalogSlice.reducer;
