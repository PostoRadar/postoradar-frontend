import { authClient } from './authClient';
import { getRefreshToken, setTokens } from './tokenStorage';

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Deduplica renovações concorrentes: tanto a hidratação inicial do AuthContext
// (GET /auth/me com um token possivelmente expirado) quanto o interceptor de
// 401 do apiClient podem precisar renovar ao mesmo tempo. O postoradar-auth
// ROTACIONA o refresh token a cada uso (o anterior é revogado), então duas
// chamadas paralelas a /auth/refresh quebrariam uma a outra — por isso as
// duas pontas do app compartilham esta mesma promise em vez de cada uma ter
// sua própria cópia da lógica de refresh.
let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function doRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('Sem refresh token disponível');
  }

  const { data } = await authClient.post<RefreshResponse>('/auth/refresh', { refreshToken });
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.accessToken;
}
