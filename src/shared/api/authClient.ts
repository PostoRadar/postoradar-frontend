import axios from 'axios';
import { env } from '../config/env';

/**
 * Client dedicado ao postoradar-auth. Não leva o interceptor de refresh do
 * apiClient — usado justamente para obter/renovar os tokens.
 */
export const authClient = axios.create({
  baseURL: env.authApiUrl,
});
