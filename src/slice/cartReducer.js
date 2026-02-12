import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createAsyncMessage } from './messageReducer';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const initialState = {
  cart: { carts: [], total: 0, final_total: 0 },
  isPageLoading: true,
  loadingItemId: null,
  isSubmitting: false,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      dispatch(setCart(res.data.data));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, '載入購物車失敗'));
    } finally {
      dispatch(setPageLoading(false));
    }
  },
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, qty }, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: { product_id: productId, qty },
      });
      dispatch(createAsyncMessage({ success: true, message: '已加入購物車' }));
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      const message = getErrorMessage(error, '加入購物車失敗');
      dispatch(createAsyncMessage({ success: false, message }));
      return rejectWithValue(message);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, productId, qty }, { dispatch, rejectWithValue }) => {
    dispatch(setLoadingItemId(id));
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${id}`, {
        data: { product_id: productId, qty },
      });
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      const message = getErrorMessage(error, '更新購物車失敗');
      dispatch(createAsyncMessage({ success: false, message }));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoadingItemId(null));
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(setLoadingItemId(id));
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      const message = getErrorMessage(error, '刪除購物車項目失敗');
      dispatch(createAsyncMessage({ success: false, message }));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoadingItemId(null));
    }
  },
);

export const deleteCartAll = createAsyncThunk(
  'cart/deleteCartAll',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoadingItemId('all'));
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      const message = getErrorMessage(error, '清空購物車失敗');
      dispatch(createAsyncMessage({ success: false, message }));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoadingItemId(null));
    }
  },
);

export const submitOrder = createAsyncThunk(
  'cart/submitOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    dispatch(setSubmitting(true));
    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data: orderData,
      });
      dispatch(createAsyncMessage({ success: true, message: '訂單已送出！' }));
      await dispatch(fetchCart()).unwrap();
      return { orderId: res.data.orderId };
    } catch (error) {
      const message = getErrorMessage(error, '送出訂單失敗');
      dispatch(createAsyncMessage({ success: false, message }));
      return rejectWithValue(message);
    } finally {
      dispatch(setSubmitting(false));
    }
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      state.cart = action.payload;
    },
    setPageLoading(state, action) {
      state.isPageLoading = action.payload;
    },
    setLoadingItemId(state, action) {
      state.loadingItemId = action.payload;
    },
    setSubmitting(state, action) {
      state.isSubmitting = action.payload;
    },
  },
});
// redux 繞來繞去繞來繞去= ="
export const { setCart, setPageLoading, setLoadingItemId, setSubmitting } =
  cartSlice.actions;
export default cartSlice.reducer;
