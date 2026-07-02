import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Coordinates } from '../proximity';

type GeoStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unsupported';

interface GeoLocationContextValue {
  location: Coordinates | null;
  status: GeoStatus;
  error: string | null;
  requestLocation: () => void;
}

const GeoLocationContext = createContext<GeoLocationContextValue | undefined>(undefined);

export function GeoLocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Pedir permissão de geolocalização automaticamente ao carregar a Home é
  // uma má prática de UX (prompt sem contexto). Em vez disso, expomos esta
  // função para ser chamada quando o usuário escolher "ordenar por
  // proximidade" ou "usar minha localização" no mapa.
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      setError('Seu navegador não suporta geolocalização.');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('granted');
      },
      (err) => {
        setStatus('denied');
        setError(err.message || 'Não foi possível obter sua localização.');
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  }, []);

  const value = useMemo<GeoLocationContextValue>(
    () => ({ location, status, error, requestLocation }),
    [location, status, error, requestLocation],
  );

  return <GeoLocationContext.Provider value={value}>{children}</GeoLocationContext.Provider>;
}

export function useUserLocation(): GeoLocationContextValue {
  const ctx = useContext(GeoLocationContext);
  if (!ctx) {
    throw new Error('useUserLocation deve ser usado dentro de <GeoLocationProvider>');
  }
  return ctx;
}
