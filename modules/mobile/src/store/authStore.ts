import {create} from 'zustand';

interface AuthStore {
  isLoggedIn: boolean;
  loading: boolean;
}

export const useAuthStore = create<AuthStore>(set => ({
  isLoggedIn: false,
  loading: false,
  logIn: () => set({isLoggedIn: true}),
  logOut: () => set({isLoggedIn: false}),
}));
