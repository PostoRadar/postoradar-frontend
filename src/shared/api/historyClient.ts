import axios from 'axios';
import { env } from '../config/env';

/**
 * Client dedicado ao postoradar-history. Serviço de consulta pública (histórico
 * de preços), sem autenticação — não leva os interceptors de token do apiClient.
 */
export const historyClient = axios.create({
  baseURL: env.historyUrl,
});
