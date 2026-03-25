import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Appointment, MOCK_APPOINTMENTS } from "./types";

// ─── State ────────────────────────────────────────────────────────────────────
type AppointmentsState = {
  items: Appointment[];
  selected: Appointment | null;
  loading: boolean;
  error: string | null;
};

const initialState: AppointmentsState = {
  items: MOCK_APPOINTMENTS, // swap with [] when using real API
  selected: null,
  loading: false,
  error: null,
};

// ─── Async Thunks (ready for API) ─────────────────────────────────────────────
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Replace with real API call:
      // const res = await fetch("/api/appointments");
      // return await res.json();
      return MOCK_APPOINTMENTS;
    } catch (err) {
      return rejectWithValue("Failed to fetch appointments");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<Appointment | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelected } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
