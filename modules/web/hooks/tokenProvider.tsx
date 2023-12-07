'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {TOKEN_LOCAL_STORAGE} from '../app/api/graphql/consts';

export interface TokenProvider {
  token: string;
  clearToken: () => void;
  setNewToken: (newToken: string) => void;
  hasFetched: boolean;
}

const TokenContext = createContext<TokenProvider>({
  token: '',
  setNewToken: () => null,
  clearToken: () => null,
  hasFetched: false,
});

export const TokenProvider = ({children}: {children: React.ReactNode}) => {
  const [token, setToken] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const storageToken = localStorage.getItem(TOKEN_LOCAL_STORAGE);
    if (storageToken) setToken(storageToken);
    setHasFetched(true);
  }, []);

  const clearToken = useCallback(
    () => localStorage.removeItem(TOKEN_LOCAL_STORAGE),
    [],
  );

  const setNewToken = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem(TOKEN_LOCAL_STORAGE, newToken);
  }, []);

  return (
    <TokenContext.Provider value={{token, clearToken, setNewToken, hasFetched}}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => useContext(TokenContext);
