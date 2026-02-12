import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createAsyncMessage } from './messageReducer';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const initialState = {
  cart: { carts: [], total: 0, final_total: 0 },
  isPageLoading: true,
  loadingItemId: null,
  isSubmitting: false,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { dispatch }) => {
    const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
    dispatch(setCart(res.data.data));
    dispatch(setPageLoading(false));
  },
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, qty }, { dispatch }) => {
    await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
      data: { product_id: productId, qty },
    });
    dispatch(createAsyncMessage({ success: true, message: '已加入購物車' }));
    dispatch(fetchCart());
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, productId, qty }, { dispatch }) => {
    dispatch(setLoadingItemId(id));
    await axios.put(`${API_BASE}/api/${API_PATH}/cart/${id}`, {
      data: { product_id: productId, qty },
    });
    await dispatch(fetchCart());
    dispatch(setLoadingItemId(null));
  },
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (id, { dispatch }) => {
    dispatch(setLoadingItemId(id));
    await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
    await dispatch(fetchCart());
    dispatch(setLoadingItemId(null));
  },
);

export const deleteCartAll = createAsyncThunk(
  'cart/deleteCartAll',
  async (_, { dispatch }) => {
    dispatch(setLoadingItemId('all'));
    await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
    await dispatch(fetchCart());
    dispatch(setLoadingItemId(null));
  },
);

export const submitOrder = createAsyncThunk(
  'cart/submitOrder',
  async (orderData, { dispatch }) => {
    dispatch(setSubmitting(true));
    const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
      data: orderData,
    });
    dispatch(createAsyncMessage({ success: true, message: '訂單已送出！' }));
    await dispatch(fetchCart());
    dispatch(setSubmitting(false));
    return { orderId: res.data.orderId };
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
