import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "employee" | "client";

export interface AuthUser {
  name:  string;
  email: string;
  role:  UserRole;
}

interface AuthState {
  user:    AuthUser | null;
  loading: boolean;
  error:   string;
}

const initialState: AuthState = {
  user:    null,
  loading: false,
  error:   "",
};

// Mock user DB — replace with real API calls when backend is ready
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { email: "admin@appointmanager.com",   password: "admin123",    role: "admin",    name: "Alex Rivera"    },
  { email: "sarah@appointmanager.com",   password: "employee123", role: "employee", name: "Sarah Johnson"  },
  { email: "michael@appointmanager.com", password: "employee123", role: "employee", name: "Michael Chen"   },
  { email: "david@appointmanager.com",   password: "employee123", role: "employee", name: "David Ross"     },
  { email: "client@example.com",         password: "client123",   role: "client",   name: "Alex Thompson"  },
  { email: "jane@example.com",           password: "client123",   role: "client",   name: "Jane Smith"     },
];

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error   = "";
    },
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.loading = false;
      state.user    = action.payload;
      state.error   = "";
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error   = action.payload;
    },
    registerStart(state) {
      state.loading = true;
      state.error   = "";
    },
    registerSuccess(state, action: PayloadAction<AuthUser>) {
      state.loading = false;
      state.user    = action.payload;
      state.error   = "";
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error   = action.payload;
    },
    logout(state) {
      state.user    = null;
      state.error   = "";
      state.loading = false;
    },
    clearError(state) {
      state.error = "";
    },
  },
});

export const {
  loginStart, loginSuccess, loginFailure,
  registerStart, registerSuccess, registerFailure,
  logout, clearError,
} = authSlice.actions;

export default authSlice.reducer;

// ── Thunks ────────────────────────────────────────────────────────────────────
// Replace the mock logic below with real fetch/axios calls to your backend

export const ROLE_REDIRECT: Record<UserRole, string> = {
  admin:    "/admin/dashboard",
  employee: "/employee/dashboard",
  client:   "/client/dashboard",
};

export function loginThunk(email: string, password: string) {
  return (dispatch: import("@reduxjs/toolkit").Dispatch) => {
    dispatch(loginStart());
    // Simulate async API call
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (!user) {
        dispatch(loginFailure("Invalid email or password."));
        return;
      }
      const { password: _pw, ...authUser } = user;
      dispatch(loginSuccess(authUser));
    }, 600);
  };
}

export function registerThunk(name: string, email: string, password: string) {
  return (dispatch: import("@reduxjs/toolkit").Dispatch) => {
    dispatch(registerStart());
    setTimeout(() => {
      if (MOCK_USERS.find(u => u.email === email)) {
        dispatch(registerFailure("An account with this email already exists."));
        return;
      }
      // New clients register as "client" role by default
      const newUser: AuthUser = { name, email, role: "client" };
      dispatch(registerSuccess(newUser));
    }, 600);
  };
}
