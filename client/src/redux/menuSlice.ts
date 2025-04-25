import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../lib/api";

/**
 * @interface MenuItem
 * @description Interface for a menu item.
 * @param {string} _id - The unique identifier of the menu item.
 * @param {string} name - The name of the menu item.
 * @param {string} description - A description of the menu item (optional).
 * @param {number} price - The price of the menu item.
 * @param {string} category - The category of the menu item.
 * @param {boolean} available - Whether the menu item is currently available.
 * @param {boolean} isSpecial - Whether the menu item is a special item.
 */
export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  isSpecial: boolean;
}

/**
 * @interface MenuState
 * @description Interface for the menu state.
 * @param {MenuItem[]} items - An array of menu items.
 * @param {MenuItem | null} selectedItem - The currently selected menu item, or null if none is selected.
 * @param {boolean} loading - Whether the menu data is currently being loaded.
 * @param {string | null} error - Any error message that occurred while loading the menu data, or null if there was no error.
 */
interface MenuState {
  items: MenuItem[];
  selectedItem: MenuItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

/**
 * @asyncThunk fetchMenuItems
 * @description Async thunk action to fetch menu items.
 * @param {string} category - The category to filter menu items by (optional).
 * @returns {Promise<MenuItem[]>} - A promise that resolves with an array of menu items.
 */
export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async (category?: string, { rejectWithValue }) => {
    try {
      const response = await api.getMenuItems(category);
      return response.menuItems;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch menu items");
    }
  }
);

/**
 * @asyncThunk getMenuItemById
 * @description Async thunk action to get a menu item by its ID.
 * @param {string} id - The ID of the menu item to fetch.
 * @returns {Promise<MenuItem>} - A promise that resolves with the menu item.
 */
export const getMenuItemById = createAsyncThunk(
  "menu/getMenuItemById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getMenuItem(id);
      return response.menuItem;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch menu item");
    }
  }
);

/**
 * @asyncThunk createMenuItem
 * @description Async thunk action to create a new menu item.
 * @param {Omit<MenuItem, '_id'>} data - The data for the new menu item, excluding the ID.
 * @returns {Promise<MenuItem>} - A promise that resolves with the newly created menu item.
 */
export const createMenuItem = createAsyncThunk(
  "menu/createMenuItem",
  async (data: Omit<MenuItem, "_id">, { rejectWithValue }) => {
    try {
      const response = await api.createMenuItem(data);
      return response.menuItem;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create menu item");
    }
  }
);

/**
 * @asyncThunk updateMenuItem
 * @description Async thunk action to update an existing menu item.
 * @param {string} id - The ID of the menu item to update.
 * @param {Partial<MenuItem>} data - The data to update for the menu item.
 * @returns {Promise<MenuItem>} - A promise that resolves with the updated menu item.
 */
export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async (
    { id, data }: { id: string; data: Partial<MenuItem> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.updateMenuItem(id, data);
      return response.menuItem;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update menu item");
    }
  }
);

/**
 * @asyncThunk deleteMenuItem
 * @description Async thunk action to delete a menu item.
 * @param {string} id - The ID of the menu item to delete.
 * @returns {Promise<string>} - A promise that resolves with the ID of the deleted menu item.
 */
export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteMenuItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete menu item");
    }
  }
);

/**
 * @slice menuSlice
 * @description Redux slice for managing menu items.
 */
const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    /**
     * @reducer selectMenuItem
     * @description Reducer to select a menu item.
     * @param {MenuState} state - The current menu state.
     * @param {PayloadAction<MenuItem>} action - The action containing the menu item to select.
     */
    selectMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.selectedItem = action.payload;
    },
    /**
     * @reducer clearSelectedMenuItem
     * @description Reducer to clear the selected menu item.
     * @param {MenuState} state - The current menu state.
     */
    clearSelectedMenuItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMenuItems.fulfilled,
        (state, action: PayloadAction<MenuItem[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMenuItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getMenuItemById.fulfilled,
        (state, action: PayloadAction<MenuItem>) => {
          state.loading = false;
          state.selectedItem = action.payload;
        }
      )
      .addCase(getMenuItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createMenuItem.fulfilled,
        (state, action: PayloadAction<MenuItem>) => {
          state.loading = false;
          state.items.push(action.payload);
        }
      )
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateMenuItem.fulfilled,
        (state, action: PayloadAction<MenuItem>) => {
          state.loading = false;
          state.items = state.items.map((item) =>
            item._id === action.payload._id ? action.payload : item
          );
          if (
            state.selectedItem &&
            state.selectedItem._id === action.payload._id
          ) {
            state.selectedItem = action.payload;
          }
        }
      )
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMenuItem.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.items = state.items.filter(
            (item) => item._id !== action.payload
          );
          if (state.selectedItem && state.selectedItem._id === action.payload) {
            state.selectedItem = null;
          }
        }
      )
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectMenuItem, clearSelectedMenuItem } = menuSlice.actions;
export default menuSlice.reducer;
