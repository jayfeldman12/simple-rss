import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {TOKEN_LOCAL_STORAGE} from '../pages/api/graphql/consts';

export interface TokenProvider {
  token: string;
  clearToken: () => void;
  setNewToken: (newToken: string) => void;
}

const TokenContext = createContext<TokenProvider>({
  token: '',
  setNewToken: () => null,
  clearToken: () => null,
});

export const TokenProvider = ({children}: {children: React.ReactNode}) => {
  const [token, setToken] = useState('');
  useEffect(() => {
    const storageToken = localStorage.getItem(TOKEN_LOCAL_STORAGE);
    if (storageToken) setToken(storageToken);
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
    <TokenContext.Provider value={{token, clearToken, setNewToken}}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => useContext(TokenContext);
