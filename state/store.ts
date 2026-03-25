import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "@/state/slices/appointments/appointmentsSlice";
import notificationsReducer from "@/state/slices/notifications/notificationsSlice";
import authReducer from "@/state/slices/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    appointments:  appointmentsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
