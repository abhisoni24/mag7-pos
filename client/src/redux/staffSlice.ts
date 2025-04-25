import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../lib/api";

/**
 * @interface StaffMember
 * @description Interface representing a staff member.
 * @param {string} id - The unique identifier of the staff member.
 * @param {string} name - The name of the staff member.
 * @param {string} email - The email address of the staff member.
 * @param {string} role - The role of the staff member.
 * @param {boolean} active - Whether the staff member is active.
 */
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

/**
 * @interface StaffState
 * @description Interface representing the staff state in the Redux store.
 * @param {StaffMember[]} staff - An array of staff members.
 * @param {StaffMember | null} selectedStaff - The currently selected staff member, or null if none is selected.
 * @param {boolean} loading - Indicates whether the staff data is currently being loaded.
 * @param {string | null} error - Any error message that occurred while loading the staff data, or null if there was no error.
 */
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

/**
 * @asyncThunk fetchStaff
 * @description Async thunk action to fetch staff members from the server.
 * @param {string} role - Optional role to filter staff members by.
 * @returns {Promise<StaffMember[]>} - A promise that resolves with an array of staff members.
 */
export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (role?: string, { rejectWithValue }) => {
    try {
      const response = await api.getStaff(role);
      return response.staff;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch staff");
    }
  }
);

/**
 * @asyncThunk getStaffMember
 * @description Async thunk action to get a single staff member by ID from the server.
 * @param {string} id - The ID of the staff member to fetch.
 * @returns {Promise<StaffMember>} - A promise that resolves with the staff member.
 */
export const getStaffMember = createAsyncThunk(
  "staff/getStaffMember",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getStaffMember(id);
      return response.staff;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch staff member");
    }
  }
);

/**
 * @asyncThunk createStaffMember
 * @description Async thunk action to create a new staff member on the server.
 * @param {Object} data - The data for the new staff member.
 * @param {string} data.name - The name of the staff member.
 * @param {string} data.email - The email address of the staff member.
 * @param {string} data.password - The password of the staff member.
 * @param {string} data.role - The role of the staff member.
 * @returns {Promise<StaffMember>} - A promise that resolves with the newly created staff member.
 */
export const createStaffMember = createAsyncThunk(
  "staff/createStaffMember",
  async (
    data: { name: string; email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.createStaffMember(data);
      return response.staff;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create staff member");
    }
  }
);

/**
 * @asyncThunk updateStaffMember
 * @description Async thunk action to update an existing staff member on the server.
 * @param {Object} params - An object containing the ID of the staff member to update and the updated data.
 * @param {string} params.id - The ID of the staff member to update.
 * @param {Object} params.data - The updated data for the staff member.
 * @returns {Promise<StaffMember>} - A promise that resolves with the updated staff member.
 */
export const updateStaffMember = createAsyncThunk(
  "staff/updateStaffMember",
  async (
    {
      id,
      data,
    }: { id: string; data: Partial<StaffMember> & { password?: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.updateStaffMember(id, data);
      return response.staff;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update staff member");
    }
  }
);

/**
 * @asyncThunk deleteStaffMember
 * @description Async thunk action to delete a staff member from the server.
 * @param {string} id - The ID of the staff member to delete.
 * @returns {Promise<string>} - A promise that resolves with the ID of the deleted staff member.
 */
export const deleteStaffMember = createAsyncThunk(
  "staff/deleteStaffMember",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteStaffMember(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete staff member");
    }
  }
);

/**
 * @slice staffSlice
 * @description Redux slice for managing staff members.
 */
const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    /**
     * @reducer selectStaffMember
     * @description Reducer to select a staff member.
     * @param {StaffState} state - The current staff state.
     * @param {PayloadAction<StaffMember>} action - The action containing the staff member to select.
     */
    selectStaffMember: (state, action: PayloadAction<StaffMember>) => {
      state.selectedStaff = action.payload;
    },
    /**
     * @reducer clearSelectedStaffMember
     * @description Reducer to clear the selected staff member.
     * @param {StaffState} state - The current staff state.
     */
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
      .addCase(
        fetchStaff.fulfilled,
        (state, action: PayloadAction<StaffMember[]>) => {
          state.loading = false;
          state.staff = action.payload;
        }
      )
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getStaffMember.fulfilled,
        (state, action: PayloadAction<StaffMember>) => {
          state.loading = false;
          state.selectedStaff = action.payload;
        }
      )
      .addCase(getStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createStaffMember.fulfilled,
        (state, action: PayloadAction<StaffMember>) => {
          state.loading = false;
          state.staff.push(action.payload);
        }
      )
      .addCase(createStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateStaffMember.fulfilled,
        (state, action: PayloadAction<StaffMember>) => {
          state.loading = false;
          state.staff = state.staff.map((member) =>
            member.id === action.payload.id ? action.payload : member
          );
          if (
            state.selectedStaff &&
            state.selectedStaff.id === action.payload.id
          ) {
            state.selectedStaff = action.payload;
          }
        }
      )
      .addCase(updateStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteStaffMember.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.staff = state.staff.filter(
            (member) => member.id !== action.payload
          );
          if (
            state.selectedStaff &&
            state.selectedStaff.id === action.payload
          ) {
            state.selectedStaff = null;
          }
        }
      )
      .addCase(deleteStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectStaffMember, clearSelectedStaffMember } =
  staffSlice.actions;
export default staffSlice.reducer;
