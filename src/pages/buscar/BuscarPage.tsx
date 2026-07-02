import { useState } from 'react';
import { usePostosQuery } from '../../features/postos/api/postos.queries';
import { PostoFilterBar, type PostoFiltrosUI } from '../../features/postos/components/PostoFilterBar';
import { PostoList } from '../../features/postos/components/PostoList';
import { useProximitySortedPostos } from '../../features/postos/hooks/useProximitySortedPostos';
import type { OrdenarPor } from '../../features/postos/types/postos.types';
import { MapView } from '../../features/map/components/MapView';
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import { Spinner } from '../../shared/components/Spinner';
import { useUserLocation } from '../../shared/geo/context/GeoLocationContext';

const INITIAL_FILTROS: PostoFiltrosUI = {
  cidade: '',
  bandeira: '',
  combustivel: '',
  ordenarPor: 'recentes',
};

export function BuscarPage() {
  const [filtros, setFiltros] = useState<PostoFiltrosUI>(INITIAL_FILTROS);
  const { location: userLocation } = useUserLocation();

  const combustivel = filtros.combustivel || undefined;
  // Regra do backend: ordenarPor=preco exige combustivel. 'proximidade' nunca
  // vai pra API — o servidor continua retornando por 'recentes' e o client
  // reordena localmente (ver useProximitySortedPostos).
  const apiOrdenarPor: OrdenarPor = filtros.ordenarPor === 'preco' && combustivel ? 'preco' : 'recentes';

  const {
    data: postos,
    isLoading,
    isError,
    error,
  } = usePostosQuery({
    cidade: filtros.cidade || undefined,
    bandeira: filtros.bandeira || undefined,
    combustivel,
    ordenarPor: apiOrdenarPor,
  });

  const proximitySorted = useProximitySortedPostos(
    postos,
    userLocation,
    filtros.ordenarPor === 'proximidade',
  );

  const postosExibidos = filtros.ordenarPor === 'proximidade' && proximitySorted ? proximitySorted : postos ?? [];

  return (
    <div>
      <PostoFilterBar filtros={filtros} onChange={setFiltros} />
      <div style={{ display: 'flex', gap: 16, padding: 16, flexWrap: 'wrap' }}>
        <div
          style={{
            flex: '1 1 400px',
            minHeight: 420,
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <MapView postos={postosExibidos} userLocation={userLocation} />
        </div>
        <div style={{ flex: '1 1 320px', maxWidth: 420 }}>
          {isLoading && <Spinner label="Carregando postos..." />}
          {isError && (
            <ErrorBanner message={error instanceof Error ? error.message : 'Erro ao carregar postos.'} />
          )}
          {!isLoading && !isError && <PostoList postos={postosExibidos} />}
        </div>
      </div>
    </div>
  );
}
