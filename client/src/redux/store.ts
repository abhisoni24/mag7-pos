import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tableReducer from "./tableSlice";
import orderReducer from "./orderSlice";
import menuReducer from "./menuSlice";
import staffReducer from "./staffSlice";
import reportReducer from "./reportSlice";

/**
 * @constant store
 * @description Configures the Redux store with the provided reducers.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tableReducer,
    orders: orderReducer,
    menu: menuReducer,
    staff: staffReducer,
    reports: reportReducer,
  },
});

/**
 * @typedef RootState
 * @description Represents the type of the root state of the Redux store.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * @typedef AppDispatch
 * @description Represents the type of the dispatch function of the Redux store.
 */
export type AppDispatch = typeof store.dispatch;
