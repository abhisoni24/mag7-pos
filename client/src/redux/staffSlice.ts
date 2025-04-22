import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../lib/api';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface StaffState {
  staff: StaffMember[];
  selectedStaff: StaffMember | null;
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staff: [],
  selectedStaff: null,
  loading: false,
  error: null,
};

export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (role?: string, { rejectWithValue }) => {
    try {
      const response = await api.getStaff(role);
      return response.staff;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch staff');
    }
  }
);

export const getStaffMember = createAsyncThunk(
  'staff/getStaffMember',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getStaffMember(id);
      return response.staff;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch staff member');
    }
  }
);

export const createStaffMember = createAsyncThunk(
  'staff/createStaffMember',
  async (data: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await api.createStaffMember(data);
      return response.staff;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create staff member');
    }
  }
);

export const updateStaffMember = createAsyncThunk(
  'staff/updateStaffMember',
  async ({ id, data }: { id: string; data: Partial<StaffMember> & { password?: string } }, { rejectWithValue }) => {
    try {
      const response = await api.updateStaffMember(id, data);
      return response.staff;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update staff member');
    }
  }
);

export const deleteStaffMember = createAsyncThunk(
  'staff/deleteStaffMember',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteStaffMember(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete staff member');
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    selectStaffMember: (state, action: PayloadAction<StaffMember>) => {
      state.selectedStaff = action.payload;
    },
    clearSelectedStaffMember: (state) => {
      state.selectedStaff = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action: PayloadAction<StaffMember[]>) => {
        state.loading = false;
        state.staff = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffMember.fulfilled, (state, action: PayloadAction<StaffMember>) => {
        state.loading = false;
        state.selectedStaff = action.payload;
      })
      .addCase(getStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaffMember.fulfilled, (state, action: PayloadAction<StaffMember>) => {
        state.loading = false;
        state.staff.push(action.payload);
      })
      .addCase(createStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaffMember.fulfilled, (state, action: PayloadAction<StaffMember>) => {
        state.loading = false;
        state.staff = state.staff.map(member =>
          member.id === action.payload.id ? action.payload : member
        );
        if (state.selectedStaff && state.selectedStaff.id === action.payload.id) {
          state.selectedStaff = action.payload;
        }
      })
      .addCase(updateStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaffMember.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.staff = state.staff.filter(member => member.id !== action.payload);
        if (state.selectedStaff && state.selectedStaff.id === action.payload) {
          state.selectedStaff = null;
        }
      })
      .addCase(deleteStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectStaffMember, clearSelectedStaffMember } = staffSlice.actions;
export default staffSlice.reducer;
