import { configureStore } from '@reduxjs/toolkit';
import messageReducer from '../slice/messageReducer';
import cartReducer from '../slice/cartReducer';
import catalogReducer from '../slice/catalogReducer';
import orderReducer from '../slice/orderReducer';

export const store = configureStore({
  reducer: {
    message: messageReducer,
    cart: cartReducer,
    catalog: catalogReducer,
    order: orderReducer,
  },
});

export default store;
