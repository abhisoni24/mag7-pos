import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../lib/api';

interface ItemFrequency {
  menuItemId: string;
  name: string;
  count: number;
}

interface RevenueData {
  totalRevenue: number;
  revenueByMethod: Record<string, number>;
  totalTips: number;
  dailyRevenue: Record<string, number>;
}

interface OrderStatistics {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  averageOrderAmount: number;
  ordersByDayOfWeek: Record<string, number>;
}

interface ReportState {
  itemFrequency: ItemFrequency[];
  revenueData: RevenueData | null;
  orderStatistics: OrderStatistics | null;
  startDate: string;
  endDate: string;
  loading: boolean;
  error: string | null;
}

const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

const initialState: ReportState = {
  itemFrequency: [],
  revenueData: null,
  orderStatistics: null,
  startDate: thirtyDaysAgo.toISOString().split('T')[0],
  endDate: today.toISOString().split('T')[0],
  loading: false,
  error: null,
};

export const fetchItemFrequency = createAsyncThunk(
  'reports/fetchItemFrequency',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await api.getItemOrderFrequency(startDate, endDate);
      return response.itemFrequency;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch item frequency data');
    }
  }
);

export const fetchRevenueData = createAsyncThunk(
  'reports/fetchRevenueData',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await api.getRevenue(startDate, endDate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch revenue data');
    }
  }
);

export const fetchOrderStatistics = createAsyncThunk(
  'reports/fetchOrderStatistics',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await api.getOrderStatistics(startDate, endDate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order statistics');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemFrequency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemFrequency.fulfilled, (state, action: PayloadAction<ItemFrequency[]>) => {
        state.loading = false;
        state.itemFrequency = action.payload;
      })
      .addCase(fetchItemFrequency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action: PayloadAction<RevenueData>) => {
        state.loading = false;
        state.revenueData = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatistics.fulfilled, (state, action: PayloadAction<OrderStatistics>) => {
        state.loading = false;
        state.orderStatistics = action.payload;
      })
      .addCase(fetchOrderStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDateRange } = reportSlice.actions;
export default reportSlice.reducer;
