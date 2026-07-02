import axios from 'axios';
import { env } from '../config/env';

/**
 * Client dedicado ao postoradar-geo. Serviço stateless, sem autenticação —
 * não leva os interceptors de token do apiClient.
 */
export const geoClient = axios.create({
  baseURL: env.geoApiUrl,
});
