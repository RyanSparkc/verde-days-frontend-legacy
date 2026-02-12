import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createAsyncMessage } from './messageReducer';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const initialState = {
  orders: [],
  pagination: null,
  currentOrder: null,
  isOrdersLoading: false,
  isOrderLoading: false,
  payingOrderId: null,
  ordersError: null,
  orderError: null,
};

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/${API_PATH}/orders?page=${page}`);
      if (!data.success) {
        throw new Error('載入訂單列表失敗');
      }

      return {
        orders: Array.isArray(data.orders) ? data.orders : [],
        pagination: data.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, '載入訂單列表失敗'));
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/${API_PATH}/order/${id}`);
      if (!data.success || !data.order) {
        throw new Error('找不到訂單');
      }

      return data.order;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, '載入訂單詳情失敗'));
    }
  },
);

export const payOrder = createAsyncThunk(
  'order/payOrder',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/pay/${orderId}`);
      dispatch(createAsyncMessage({ success: true, message: '付款完成' }));
      await dispatch(fetchOrderById(orderId)).unwrap();
      dispatch(fetchOrders());
      return orderId;
    } catch (error) {
      const message = getErrorMessage(error, '付款失敗');
      dispatch(createAsyncMessage({ success: false, message }));
      return rejectWithValue(message);
    }
  },
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.orderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersError = action.payload || '載入訂單列表失敗';
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.currentOrder = null;
        state.orderError = action.payload || '載入訂單詳情失敗';
      })
      .addCase(payOrder.pending, (state, action) => {
        state.payingOrderId = action.meta.arg;
      })
      .addCase(payOrder.fulfilled, (state) => {
        state.payingOrderId = null;
      })
      .addCase(payOrder.rejected, (state) => {
        state.payingOrderId = null;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
