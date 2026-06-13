import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthUser } from '@infygen/interfaces';

export interface AuthState {
  user: IAuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isConsultantMode: boolean;
}

const loadInitialState = (): AuthState => {
  try {
    const token = localStorage.getItem('infygen_token');
    const userStr = localStorage.getItem('infygen_user');
    if (token && userStr) {
      const user = JSON.parse(userStr) as IAuthUser;
      return {
        user,
        token,
        isAuthenticated: true,
        isConsultantMode: localStorage.getItem('infygen_consultant_mode') === 'true',
      };
    }
  } catch {
    // ignore parse errors
  }
  return { user: null, token: null, isAuthenticated: false, isConsultantMode: false };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: IAuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('infygen_token', action.payload.token);
      localStorage.setItem('infygen_user', JSON.stringify(action.payload.user));
    },
    updateUser(state, action: PayloadAction<Partial<IAuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('infygen_user', JSON.stringify(state.user));
      }
    },
    enterConsultantMode(state) {
      state.isConsultantMode = true;
      localStorage.setItem('infygen_consultant_mode', 'true');
    },
    exitConsultantMode(state) {
      state.isConsultantMode = false;
      localStorage.removeItem('infygen_consultant_mode');
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isConsultantMode = false;
      localStorage.removeItem('infygen_token');
      localStorage.removeItem('infygen_user');
      localStorage.removeItem('infygen_consultant_mode');
    },
  },
});

export const { setCredentials, updateUser, logout, enterConsultantMode, exitConsultantMode } =
  authSlice.actions;
export default authSlice.reducer;
