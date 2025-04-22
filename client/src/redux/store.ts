import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tableReducer from './tableSlice';
import orderReducer from './orderSlice';
import menuReducer from './menuSlice';
import staffReducer from './staffSlice';
import reportReducer from './reportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tableReducer,
    orders: orderReducer,
    menu: menuReducer,
    staff: staffReducer,
    reports: reportReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
