import { useEffect, useMemo, useState } from 'react';
import { usePostosQuery } from '../../features/postos/api/postos.queries';
import { PostoFilterBar, type PostoFiltrosUI } from '../../features/postos/components/PostoFilterBar';
import { PostoList } from '../../features/postos/components/PostoList';
import { useProximitySortedPostos } from '../../features/postos/hooks/useProximitySortedPostos';
import type { OrdenarPor } from '../../features/postos/types/postos.types';
import { MapView } from '../../features/map/components/MapView';
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import { Spinner } from '../../shared/components/Spinner';
import { useUserLocation } from '../../shared/geo/context/GeoLocationContext';
import { haversineKm } from '../../shared/geo/proximity';

const INITIAL_FILTROS: PostoFiltrosUI = {
  cidade: '',
  bandeira: '',
  combustivel: '',
  ordenarPor: 'recentes',
};

export function BuscarPage() {
  const [filtros, setFiltros] = useState<PostoFiltrosUI>(INITIAL_FILTROS);
  const { location: userLocation, requestLocation, status: locationStatus } = useUserLocation();

  // Pede a localização assim que a busca abre, para já mostrar a distância de
  // cada posto (o navegador exibe o prompt uma única vez; se negado, os cards
  // simplesmente não exibem distância).
  useEffect(() => {
    if (locationStatus === 'idle') requestLocation();
  }, [locationStatus, requestLocation]);

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

  // Distância de cada posto até o usuário, sempre que a localização existir —
  // independente da ordenação escolhida (o filtro "Mais próximos" só muda a
  // ordem; a distância aparece nos cards em qualquer modo).
  const distanciaPorId = useMemo(() => {
    if (!userLocation) return undefined;
    const mapa = new Map<string, number>();
    for (const posto of postosExibidos) {
      mapa.set(posto.id, haversineKm(userLocation, posto));
    }
    return mapa;
  }, [userLocation, postosExibidos]);

  return (
    <div className="search-shell">
      <PostoFilterBar filtros={filtros} onChange={setFiltros} />
      <div className="search-results">
        <div className="map-stage">
          <MapView postos={postosExibidos} userLocation={userLocation} />
        </div>
        {isLoading && <Spinner label="Carregando postos..." />}
        {isError && (
          <ErrorBanner message={error instanceof Error ? error.message : 'Erro ao carregar postos.'} />
        )}
        {!isLoading && !isError && (
          <PostoList
            postos={postosExibidos}
            combustivelFiltrado={combustivel}
            distanciaPorId={distanciaPorId}
          />
        )}
      </div>
    </div>
  );
}
