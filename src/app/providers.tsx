import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { GeoLocationProvider } from '../shared/geo/context/GeoLocationContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GeoLocationProvider>{children}</GeoLocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
