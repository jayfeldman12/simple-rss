import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {TOKEN_LOCAL_STORAGE} from '../queries/consts';

interface TokenStore {
  tokenInfo: {
    loading: boolean;
    token: string | null;
  };

  clearToken: () => Promise<void>;
  fetchToken: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
}

export const useTokenStore = create<TokenStore>(set => ({
  tokenInfo: {loading: true, token: null},

  clearToken: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_LOCAL_STORAGE);
      set({tokenInfo: {token: null, loading: false}});
    } catch (err) {
      console.warn('error clearing token', err);
      throw err;
    }
  },
  fetchToken: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_LOCAL_STORAGE);
      set({tokenInfo: {loading: false, token: token}});
    } catch (err) {
      console.warn('error loading token', err);
      set(state => ({
        tokenInfo: {loading: false, token: state.tokenInfo.token},
      }));
      throw err;
    }
  },
  setToken: async token => {
    try {
      await AsyncStorage.setItem(TOKEN_LOCAL_STORAGE, token);
      set({tokenInfo: {loading: false, token}});
    } catch (err) {
      console.warn('error setting token', err);
      set(state => ({
        tokenInfo: {loading: false, token: state.tokenInfo.token},
      }));
      throw err;
    }
  },
}));
