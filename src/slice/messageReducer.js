import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = [];
const FADE_DURATION = 200; // 淡出動畫時間 (ms)
const DISPLAY_DURATION = 2000; // 顯示時間 (ms)

export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(createMessage({ ...payload, id: requestId }));
    // 先等待顯示時間，再開始淡出
    setTimeout(() => {
      dispatch(startRemoveMessage(requestId));
      // 等淡出動畫結束後，才真正移除
      setTimeout(() => {
        dispatch(removeMessage(requestId));
      }, FADE_DURATION);
    }, DISPLAY_DURATION);
    return payload;
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    createMessage(state, action) {
      const { success, message, id } = action.payload;
      if (success) {
        state.push({
          id,
          type: 'success',
          title: '成功',
          text: message,
          isLeaving: false,
        });
      } else {
        const errorText = Array.isArray(message) ? message.join('、') : message;
        state.push({
          id,
          type: 'danger',
          title: '錯誤',
          text: errorText,
          isLeaving: false,
        });
      }
    },
    startRemoveMessage(state, action) {
      const msg = state.find((item) => item.id === action.payload);
      if (msg) {
        msg.isLeaving = true;
      }
    },
    removeMessage(state, action) {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { createMessage, startRemoveMessage, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
