import {create} from 'zustand';

interface AuthStore {
  isLoggedIn: boolean;
  loading: boolean;
  logIn: () => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  isLoggedIn: false,
  loading: true,
  logIn: () => set({isLoggedIn: true, loading: false}),
  logOut: () => set({isLoggedIn: false, loading: false}),
}));
