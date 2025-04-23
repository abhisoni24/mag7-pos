import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../lib/api';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: string;
}

export interface Order {
  _id?: string;
  tableId: string;
  waiterId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: { status?: string; tableId?: string; waiterId?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.getOrders(params);
      return response.orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getOrder(id);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: { tableId: string; waiterId?: string; items?: any[] }, { rejectWithValue }) => {
    try {
      const response = await api.createOrder(data);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.updateOrderStatus(id, status);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

export const addItemToOrder = createAsyncThunk(
  'orders/addItemToOrder',
  async ({ orderId, item }: { orderId: string; item: any }, { rejectWithValue }) => {
    try {
      const response = await api.addItemToOrder(orderId, item);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to order');
    }
  }
);

export const updateOrderItem = createAsyncThunk(
  'orders/updateOrderItem',
  async ({ orderId, itemId, updates }: { orderId: string; itemId: string; updates: any }, { rejectWithValue }) => {
    try {
      const response = await api.updateOrderItem(orderId, itemId, updates);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update order item');
    }
  }
);

export const createPayment = createAsyncThunk(
  'orders/createPayment',
  async (data: { orderId: string; amount: number; tip?: number; paymentMethod: string }, { rejectWithValue }) => {
    try {
      const response = await api.createPayment(data);
      return response.payment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to process payment');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        
        // Add new orders while ensuring no duplicates
        const newOrders = action.payload;
        const existingOrderIds = new Set(state.orders.map(order => order._id));
        
        // First remove any updated orders from state that exist in the new batch
        state.orders = state.orders.filter(order => 
          !newOrders.some(newOrder => newOrder._id === order._id));
        
        // Then add all the new orders
        state.orders = [...state.orders, ...newOrders];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addItemToOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(addItemToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderItem.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state) => {
        state.loading = false;
        // Refresh orders should be handled by fetchOrders
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
