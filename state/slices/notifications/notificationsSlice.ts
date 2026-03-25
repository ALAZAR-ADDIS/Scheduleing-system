import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Notification, MOCK_NOTIFICATIONS } from "./types";

type NotificationsState = {
  items: Notification[];
  loading: boolean;
  error: string | null;
};

const initialState: NotificationsState = {
  items: MOCK_NOTIFICATIONS,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Replace with real API call:
      // const res = await fetch("/api/notifications");
      // return await res.json();
      return MOCK_NOTIFICATIONS;
    } catch {
      return rejectWithValue("Failed to fetch notifications");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAllRead(state) {
      state.items = state.items.map((n) => ({ ...n, read: true }));
    },
    markOneRead(state, action: PayloadAction<number>) {
      const n = state.items.find((n) => n.id === action.payload);
      if (n) n.read = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { markAllRead, markOneRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
