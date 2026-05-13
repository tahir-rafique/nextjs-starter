import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { signIn, signOut } from "next-auth/react";

import type { AuthState, AuthUser } from "@/types/auth";

/* ── Initial state ──────────────────────────────────────────── */
const initialState: AuthState = {
  user:            null,
  isAuthenticated: false,
  isLoading:       false,
  error:           null,
};

/* ── Async thunks ───────────────────────────────────────────── */
export const loginWithCredentials = createAsyncThunk(
  "auth/loginWithCredentials",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        ...credentials,
      });
      if (result?.error) return rejectWithValue(result.error);
      return result;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await signOut({ redirect: false });
});

/* ── Slice ──────────────────────────────────────────────────── */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user            = action.payload;
      state.isAuthenticated = action.payload !== null;
      state.error           = null;
    },
    clearAuth(state) {
      state.user            = null;
      state.isAuthenticated = false;
      state.error           = null;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* login */
    builder
      .addCase(loginWithCredentials.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(loginWithCredentials.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginWithCredentials.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload as string;
      });

    /* logout */
    builder
      .addCase(logoutUser.pending, (state) => { state.isLoading = true; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user            = null;
        state.isAuthenticated = false;
        state.isLoading       = false;
        state.error           = null;
      })
      .addCase(logoutUser.rejected, (state) => { state.isLoading = false; });
  },
});

export const { setUser, clearAuth, setAuthError, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
