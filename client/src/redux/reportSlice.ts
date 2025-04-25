import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../lib/api";

/**
 * @interface ItemFrequency
 * @description Interface for item frequency data.
 * @param {string} menuItemId - The ID of the menu item.
 * @param {string} name - The name of the menu item.
 * @param {number} count - The frequency count of the menu item.
 */
interface ItemFrequency {
  menuItemId: string;
  name: string;
  count: number;
}

/**
 * @interface RevenueData
 * @description Interface for revenue data.
 * @param {number} totalRevenue - The total revenue.
 * @param {Record<string, number>} revenueByMethod - The revenue by payment method.
 * @param {number} totalTips - The total tips.
 * @param {Record<string, number>} dailyRevenue - The daily revenue.
 */
interface RevenueData {
  totalRevenue: number;
  revenueByMethod: Record<string, number>;
  totalTips: number;
  dailyRevenue: Record<string, number>;
}

/**
 * @interface OrderStatistics
 * @description Interface for order statistics.
 * @param {number} totalOrders - The total number of orders.
 * @param {Record<string, number>} ordersByStatus - The number of orders by status.
 * @param {number} averageOrderAmount - The average order amount.
 * @param {Record<string, number>} ordersByDayOfWeek - The number of orders by day of the week.
 */
interface OrderStatistics {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  averageOrderAmount: number;
  ordersByDayOfWeek: Record<string, number>;
}

/**
 * @interface ReportState
 * @description Interface for the report state.
 * @param {ItemFrequency[]} itemFrequency - The item frequency data.
 * @param {RevenueData | null} revenueData - The revenue data.
 * @param {OrderStatistics | null} orderStatistics - The order statistics.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 * @param {boolean} loading - Whether the report data is currently being loaded.
 * @param {string | null} error - Any error message that occurred while loading the report data, or null if there was no error.
 */
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
  startDate: thirtyDaysAgo.toISOString().split("T")[0],
  endDate: today.toISOString().split("T")[0],
  loading: false,
  error: null,
};

/**
 * @asyncThunk fetchItemFrequency
 * @description Async thunk action to fetch item frequency data.
 * @param {Object} params - An object containing the start and end dates for the report.
 * @param {string} params.startDate - The start date for the report.
 * @param {string} params.endDate - The end date for the report.
 * @returns {Promise<ItemFrequency[]>} - A promise that resolves with the item frequency data.
 */
export const fetchItemFrequency = createAsyncThunk(
  "reports/fetchItemFrequency",
  async (
    { startDate, endDate }: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.getItemOrderFrequency(startDate, endDate);
      return response.itemFrequency;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch item frequency data"
      );
    }
  }
);

/**
 * @asyncThunk fetchRevenueData
 * @description Async thunk action to fetch revenue data.
 * @param {Object} params - An object containing the start and end dates for the report.
 * @param {string} params.startDate - The start date for the report.
 * @param {string} params.endDate - The end date for the report.
 * @returns {Promise<RevenueData>} - A promise that resolves with the revenue data.
 */
export const fetchRevenueData = createAsyncThunk(
  "reports/fetchRevenueData",
  async (
    { startDate, endDate }: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.getRevenue(startDate, endDate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch revenue data");
    }
  }
);

/**
 * @asyncThunk fetchOrderStatistics
 * @description Async thunk action to fetch order statistics.
 * @param {Object} params - An object containing the start and end dates for the report.
 * @param {string} params.startDate - The start date for the report.
 * @param {string} params.endDate - The end date for the report.
 * @returns {Promise<OrderStatistics>} - A promise that resolves with the order statistics.
 */
export const fetchOrderStatistics = createAsyncThunk(
  "reports/fetchOrderStatistics",
  async (
    { startDate, endDate }: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.getOrderStatistics(startDate, endDate);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch order statistics"
      );
    }
  }
);

/**
 * @slice reportSlice
 * @description Redux slice for managing reports.
 */
const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    /**
     * @reducer setDateRange
     * @description Reducer to set the date range for the report.
     * @param {ReportState} state - The current report state.
     * @param {PayloadAction<{ startDate: string; endDate: string }>} action - The action containing the start and end dates.
     */
    setDateRange: (
      state,
      action: PayloadAction<{ startDate: string; endDate: string }>
    ) => {
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
      .addCase(
        fetchItemFrequency.fulfilled,
        (state, action: PayloadAction<ItemFrequency[]>) => {
          state.loading = false;
          state.itemFrequency = action.payload;
        }
      )
      .addCase(fetchItemFrequency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRevenueData.fulfilled,
        (state, action: PayloadAction<RevenueData>) => {
          state.loading = false;
          state.revenueData = action.payload;
        }
      )
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderStatistics.fulfilled,
        (state, action: PayloadAction<OrderStatistics>) => {
          state.loading = false;
          state.orderStatistics = action.payload;
        }
      )
      .addCase(fetchOrderStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDateRange } = reportSlice.actions;
export default reportSlice.reducer;
