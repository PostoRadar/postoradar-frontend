import { geoClient } from '../../api/geoClient';
import { haversineStrategy } from './haversineStrategy';
import type { ProximitySortStrategy } from './ProximitySortStrategy';

interface OrdenarResponse {
  postos: Array<{ id: string; distanciaKm: number }>;
}

/**
 * Consome o postoradar-geo (POST /geo/ordenar): manda a localização do
 * usuário + {id, latitude, longitude} de cada posto, recebe de volta a
 * distância (`distanciaKm`) por id e reordena localmente por ela.
 *
 * Se o serviço estiver fora do ar, cai para o cálculo local (haversineStrategy)
 * em vez de quebrar a busca por proximidade.
 */
export const remoteGeoStrategy: ProximitySortStrategy = {
  async sortByProximity(userLocation, items) {
    try {
      const { data } = await geoClient.post<OrdenarResponse>('/geo/ordenar', {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        postos: items.map(({ id, latitude, longitude }) => ({ id, latitude, longitude })),
      });

      const distanciaPorId = new Map(data.postos.map((posto) => [posto.id, posto.distanciaKm]));

      return items
        .map((item) => ({ ...item, distanceKm: distanciaPorId.get(item.id) ?? Number.POSITIVE_INFINITY }))
        .sort((a, b) => a.distanceKm - b.distanceKm);
    } catch (err) {
      console.warn('postoradar-geo indisponível, usando cálculo local de proximidade.', err);
      return haversineStrategy.sortByProximity(userLocation, items);
    }
  },
};
