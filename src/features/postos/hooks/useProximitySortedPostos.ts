import { useEffect, useState } from 'react';
import { activeProximityStrategy, type Coordinates } from '../../../shared/geo/proximity';
import type { Posto } from '../types/postos.types';

export type PostoComDistancia = Posto & { distanceKm: number };

/**
 * Reordena os postos já carregados por proximidade usando a estratégia ativa
 * (ver shared/geo/proximity). Só roda quando `enabled` e houver localização
 * do usuário — as demais opções de ordenação (recentes/preço) já vêm prontas
 * da API e não passam por aqui.
 */
export function useProximitySortedPostos(
  postos: Posto[] | undefined,
  userLocation: Coordinates | null,
  enabled: boolean,
): PostoComDistancia[] | null {
  const [sorted, setSorted] = useState<PostoComDistancia[] | null>(null);

  useEffect(() => {
    if (!enabled || !userLocation || !postos) {
      setSorted(null);
      return;
    }

    let cancelled = false;
    activeProximityStrategy.sortByProximity(userLocation, postos).then((result) => {
      if (!cancelled) {
        setSorted(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, userLocation, postos]);

  return sorted;
}
