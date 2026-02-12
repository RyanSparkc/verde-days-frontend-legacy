import { configureStore } from '@reduxjs/toolkit';
import messageReducer from '../slice/messageReducer';
import cartReducer from '../slice/cartReducer';
import catalogReducer from '../slice/catalogReducer';

export const store = configureStore({
  reducer: {
    message: messageReducer,
    cart: cartReducer,
    catalog: catalogReducer,
  },
});

export default store;
