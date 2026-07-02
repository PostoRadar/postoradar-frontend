import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setOnSessionExpired } from '../../../shared/api/apiClient';
import { refreshAccessToken } from '../../../shared/api/authSession';
import { ApiError } from '../../../shared/api/httpError';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../../../shared/api/tokenStorage';
import * as authApi from '../api/auth.api';
import type { LoginFormInput, RegisterFormInput } from '../schemas/auth.schemas';
import type { User } from '../types/auth.types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginFormInput) => Promise<void>;
  register: (input: RegisterFormInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  // Conecta o interceptor de refresh do apiClient a este contexto: quando o
  // refresh falhar (refresh token também expirado/revogado), a sessão em
  // memória é limpa e a UI reage como usuário deslogado.
  useEffect(() => {
    setOnSessionExpired(clearSession);
  }, [clearSession]);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    // GET /auth/me passa pelo authClient, que (ao contrário do apiClient) não
    // tem interceptor de refresh — ele é usado justamente para obter o token
    // renovado. Por isso, se o access token guardado já tiver expirado
    // (comum ao reabrir a aba depois de 15min), tentamos renovar aqui antes
    // de desistir da sessão.
    authApi
      .me(accessToken)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          return refreshAccessToken().then((newAccessToken) => authApi.me(newAccessToken));
        }
        throw err;
      })
      .then(setUser)
      .catch(() => clearSession())
      .finally(() => setIsLoading(false));
  }, [clearSession]);

  const login = useCallback(async (input: LoginFormInput) => {
    const result = await authApi.login(input);
    setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    setUser(result.user);
  }, []);

  const register = useCallback(async (input: RegisterFormInput) => {
    const result = await authApi.register(input);
    setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      // Best-effort: mesmo se a chamada falhar, a sessão local é limpa.
      await authApi.logout(refreshToken).catch(() => undefined);
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}
