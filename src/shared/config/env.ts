import { z } from 'zod';

const envSchema = z.object({
  authApiUrl: z.string().url(),
  apiUrl: z.string().url(),
  geoApiUrl: z.string().url(),
  notificationsUrl: z.string().url(),
  historyUrl: z.string().url(),
});

function loadEnv() {
  const parsed = envSchema.safeParse({
    authApiUrl: import.meta.env.VITE_AUTH_API_URL,
    apiUrl: import.meta.env.VITE_API_URL,
    geoApiUrl: import.meta.env.VITE_GEO_API_URL,
    notificationsUrl: import.meta.env.VITE_NOTIFICATIONS_URL,
    historyUrl: import.meta.env.VITE_HISTORY_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Variáveis de ambiente inválidas ou ausentes: ${parsed.error.message}`,
    );
  }

  return parsed.data;
}

export const env = loadEnv();
