import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../lib/api';

export interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: string;
  floor: number;
  waiterId?: string;
  reservationTime?: string;
  reservationName?: string;
  reservationPhone?: string;
  guestCount?: number;
}

interface TableState {
  tables: Table[];
  selectedTable: Table | null;
  loading: boolean;
  error: string | null;
}

const initialState: TableState = {
  tables: [],
  selectedTable: null,
  loading: false,
  error: null,
};

export const fetchTables = createAsyncThunk(
  'tables/fetchTables',
  async (params: { status?: string; floor?: number; waiterId?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.getTables(params);
      return response.tables;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tables');
    }
  }
);

export const getTableById = createAsyncThunk(
  'tables/getTableById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getTable(id);
      return response.table;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch table');
    }
  }
);

export const createTable = createAsyncThunk(
  'tables/createTable',
  async (data: { number: number; capacity: number; floor?: number }, { rejectWithValue }) => {
    try {
      const response = await api.createTable(data);
      return response.table;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create table');
    }
  }
);

export const updateTable = createAsyncThunk(
  'tables/updateTable',
  async ({ id, data }: { id: string; data: Partial<Table> }, { rejectWithValue }) => {
    try {
      const response = await api.updateTable(id, data);
      return response.table;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update table');
    }
  }
);

const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    selectTable: (state, action: PayloadAction<Table>) => {
      state.selectedTable = action.payload;
    },
    clearSelectedTable: (state) => {
      state.selectedTable = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action: PayloadAction<Table[]>) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTableById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTableById.fulfilled, (state, action: PayloadAction<Table>) => {
        state.loading = false;
        state.selectedTable = action.payload;
      })
      .addCase(getTableById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTable.fulfilled, (state, action: PayloadAction<Table>) => {
        state.loading = false;
        state.tables.push(action.payload);
      })
      .addCase(createTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTable.fulfilled, (state, action: PayloadAction<Table>) => {
        state.loading = false;
        state.tables = state.tables.map(table => 
          table._id === action.payload._id ? action.payload : table
        );
        if (state.selectedTable && state.selectedTable._id === action.payload._id) {
          state.selectedTable = action.payload;
        }
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectTable, clearSelectedTable } = tableSlice.actions;
export default tableSlice.reducer;
