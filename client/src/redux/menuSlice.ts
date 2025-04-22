import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../lib/api';

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  isSpecial: boolean;
}

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

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (category?: string, { rejectWithValue }) => {
    try {
      const response = await api.getMenuItems(category);
      return response.menuItems;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch menu items');
    }
  }
);

export const getMenuItemById = createAsyncThunk(
  'menu/getMenuItemById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getMenuItem(id);
      return response.menuItem;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch menu item');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (data: Omit<MenuItem, '_id'>, { rejectWithValue }) => {
    try {
      const response = await api.createMenuItem(data);
      return response.menuItem;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create menu item');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ id, data }: { id: string; data: Partial<MenuItem> }, { rejectWithValue }) => {
    try {
      const response = await api.updateMenuItem(id, data);
      return response.menuItem;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update menu item');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteMenuItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete menu item');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    selectMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.selectedItem = action.payload;
    },
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
      .addCase(fetchMenuItems.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMenuItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuItemById.fulfilled, (state, action: PayloadAction<MenuItem>) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(getMenuItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action: PayloadAction<MenuItem>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action: PayloadAction<MenuItem>) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item._id === action.payload._id ? action.payload : item
        );
        if (state.selectedItem && state.selectedItem._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.selectedItem && state.selectedItem._id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectMenuItem, clearSelectedMenuItem } = menuSlice.actions;
export default menuSlice.reducer;
