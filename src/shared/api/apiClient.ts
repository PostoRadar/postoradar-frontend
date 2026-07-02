import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { refreshAccessToken } from './authSession';
import { clearTokens, getAccessToken } from './tokenStorage';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Callback registrado pelo AuthContext para reagir a uma sessão expirada
// (limpar o usuário em memória e mandar a UI de volta para /login).
let onSessionExpired: (() => void) | null = null;
export function setOnSessionExpired(handler: () => void): void {
  onSessionExpired = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;

    if (error.response?.status !== 401 || !config || config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(config);
    } catch (refreshError) {
      clearTokens();
      onSessionExpired?.();
      return Promise.reject(refreshError);
    }
  },
);
