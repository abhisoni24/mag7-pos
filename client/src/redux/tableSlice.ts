import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../lib/api";

/**
 * @interface Table
 * @description Interface representing a table in the restaurant.
 * @param {string} _id - The unique identifier of the table.
 * @param {number} number - The table number.
 * @param {number} capacity - The maximum number of people that can sit at the table.
 * @param {string} status - The current status of the table (e.g., 'available', 'occupied', 'reserved').
 * @param {number} floor - The floor number where the table is located.
 * @param {string} waiterId - The ID of the waiter assigned to the table (optional).
 * @param {string} reservationTime - The time the table is reserved for (optional).
 * @param {string} reservationName - The name of the person who reserved the table (optional).
 * @param {string} reservationPhone - The phone number of the person who reserved the table (optional).
 * @param {number} guestCount - The number of guests for the reservation (optional).
 */
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

/**
 * @interface TableState
 * @description Interface representing the state of the tables in the Redux store.
 * @param {Table[]} tables - An array of Table objects.
 * @param {Table | null} selectedTable - The currently selected table, or null if no table is selected.
 * @param {boolean} loading - Indicates whether the table data is currently being loaded.
 * @param {string | null} error - Any error message that occurred while loading the table data, or null if there was no error.
 */
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

/**
 * @asyncThunk fetchTables
 * @description Async thunk action to fetch tables from the server.
 * @param {Object} params - An object containing optional parameters to filter the tables.
 * @param {string} params.status - The status to filter tables by (optional).
 * @param {number} params.floor - The floor number to filter tables by (optional).
 * @param {string} params.waiterId - The waiter ID to filter tables by (optional).
 * @returns {Promise<Table[]>} - A promise that resolves with an array of Table objects.
 */
export const fetchTables = createAsyncThunk(
  "tables/fetchTables",
  async (
    params: { status?: string; floor?: number; waiterId?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.getTables(params);
      return response.tables;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch tables");
    }
  }
);

/**
 * @asyncThunk getTableById
 * @description Async thunk action to get a single table by its ID from the server.
 * @param {string} id - The ID of the table to fetch.
 * @returns {Promise<Table>} - A promise that resolves with a Table object.
 */
export const getTableById = createAsyncThunk(
  "tables/getTableById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getTable(id);
      return response.table;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch table");
    }
  }
);

/**
 * @asyncThunk createTable
 * @description Async thunk action to create a new table on the server.
 * @param {Object} data - The data for the new table.
 * @param {number} data.number - The table number.
 * @param {number} data.capacity - The maximum number of people that can sit at the table.
 * @param {number} data.floor - The floor number where the table is located (optional).
 * @returns {Promise<Table>} - A promise that resolves with the newly created Table object.
 */
export const createTable = createAsyncThunk(
  "tables/createTable",
  async (
    data: { number: number; capacity: number; floor?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.createTable(data);
      return response.table;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create table");
    }
  }
);

/**
 * @asyncThunk updateTable
 * @description Async thunk action to update an existing table on the server.
 * @param {Object} params - An object containing the ID of the table to update and the updated data.
 * @param {string} params.id - The ID of the table to update.
 * @param {Object} params.data - The updated data for the table.
 * @returns {Promise<Table>} - A promise that resolves with the updated Table object.
 */
export const updateTable = createAsyncThunk(
  "tables/updateTable",
  async (
    { id, data }: { id: string; data: Partial<Table> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.updateTable(id, data);
      return response.table;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update table");
    }
  }
);

/**
 * @slice tableSlice
 * @description Redux slice for managing tables.
 */
const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    /**
     * @reducer selectTable
     * @description Reducer to select a table.
     * @param {TableState} state - The current table state.
     * @param {PayloadAction<Table>} action - The action containing the table to select.
     */
    selectTable: (state, action: PayloadAction<Table>) => {
      state.selectedTable = action.payload;
    },
    /**
     * @reducer clearSelectedTable
     * @description Reducer to clear the selected table.
     * @param {TableState} state - The current table state.
     */
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
      .addCase(
        fetchTables.fulfilled,
        (state, action: PayloadAction<Table[]>) => {
          state.loading = false;
          state.tables = action.payload;
        }
      )
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTableById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTableById.fulfilled,
        (state, action: PayloadAction<Table>) => {
          state.loading = false;
          state.selectedTable = action.payload;
        }
      )
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
        state.tables = state.tables.map((table) =>
          table._id === action.payload._id ? action.payload : table
        );
        if (
          state.selectedTable &&
          state.selectedTable._id === action.payload._id
        ) {
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
