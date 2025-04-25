import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../lib/api";

/**
 * @interface User
 * @description Interface for the user object.
 * @param {string} id - The user ID.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} role - The user's role.
 */
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * @interface AuthState
 * @description Interface for the authentication state.
 * @param {User | null} user - The authenticated user, or null if not authenticated.
 * @param {string | null} token - The authentication token, or null if not authenticated.
 * @param {boolean} isAuthenticated - Whether the user is authenticated.
 * @param {boolean} loading - Whether the authentication state is loading.
 * @param {string | null} error - Any authentication error message, or null if no error.
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

/**
 * @asyncThunk login
 * @description Async thunk action to log in a user.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} role - The user's role (optional).
 * @returns {Promise<any>} - A promise that resolves with the login response or rejects with an error.
 */
export const login = createAsyncThunk(
  "auth/login",
  async (
    {
      email,
      password,
      role,
    }: { email: string; password: string; role?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.login(email, password, role);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

/**
 * @asyncThunk getProfile
 * @description Async thunk action to get the user profile.
 * @returns {Promise<any>} - A promise that resolves with the profile response or rejects with an error.
 */
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

/**
 * @asyncThunk logout
 * @description Async thunk action to log out a user.
 * @returns {Promise<null>} - A promise that resolves with null after removing the token from local storage.
 */
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return null;
});

/**
 * @slice authSlice
 * @description Redux slice for authentication.
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * @reducer clearError
     * @description Reducer to clear the error message.
     * @param {AuthState} state - The current authentication state.
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
