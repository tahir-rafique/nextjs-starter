import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AsyncState, PaginationMeta } from "@/types/api";
import type { User, UpdateUserInput } from "@/types/user";

/* ── State shape ────────────────────────────────────────────── */
interface UserState {
  list:       AsyncState<User[]>;
  selected:   AsyncState<User>;
  pagination: PaginationMeta | null;
}

const asyncDefaults = <T>(): AsyncState<T> => ({ data: null, loading: false, error: null });

const initialState: UserState = {
  list:       asyncDefaults<User[]>(),
  selected:   asyncDefaults<User>(),
  pagination: null,
};

/* ── Async thunks ───────────────────────────────────────────── */
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (params: { page?: number; limit?: number; q?: string } = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)])
        )
      ).toString();
      const res = await fetch(`/api/users${qs ? `?${qs}` : ""}`);
      const json = await res.json();
      if (!json.success) return rejectWithValue(json.message);
      return json;
    } catch {
      return rejectWithValue("Failed to fetch users.");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      const json = await res.json();
      if (!json.success) return rejectWithValue(json.message);
      return json.data as User;
    } catch {
      return rejectWithValue("Failed to fetch user.");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: string; data: UpdateUserInput }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) return rejectWithValue(json.message);
      return json.data as User;
    } catch {
      return rejectWithValue("Failed to update user.");
    }
  }
);

/* ── Slice ──────────────────────────────────────────────────── */
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser(state) {
      state.selected = asyncDefaults<User>();
    },
    clearUserError(state) {
      state.list.error     = null;
      state.selected.error = null;
    },
    updateUserInList(state, action: PayloadAction<User>) {
      if (state.list.data) {
        state.list.data = state.list.data.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      }
    },
  },
  extraReducers: (builder) => {
    /* fetchUsers */
    builder
      .addCase(fetchUsers.pending,    (s) => { s.list.loading = true;  s.list.error = null; })
      .addCase(fetchUsers.fulfilled,  (s, a) => {
        s.list.loading = false;
        s.list.data    = a.payload.data;
        s.pagination   = a.payload.meta;
      })
      .addCase(fetchUsers.rejected,   (s, a) => { s.list.loading = false; s.list.error = a.payload as string; });

    /* fetchUserById */
    builder
      .addCase(fetchUserById.pending,   (s) => { s.selected.loading = true;  s.selected.error = null; })
      .addCase(fetchUserById.fulfilled, (s, a) => { s.selected.loading = false; s.selected.data = a.payload; })
      .addCase(fetchUserById.rejected,  (s, a) => { s.selected.loading = false; s.selected.error = a.payload as string; });

    /* updateUser */
    builder
      .addCase(updateUser.fulfilled, (s, a) => {
        s.selected.data = a.payload;
        if (s.list.data) {
          s.list.data = s.list.data.map((u) => u._id === a.payload._id ? a.payload : u);
        }
      });
  },
});

export const { clearSelectedUser, clearUserError, updateUserInList } = userSlice.actions;
export default userSlice.reducer;
