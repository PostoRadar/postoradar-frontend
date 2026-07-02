import type { Coordinates, ProximitySortStrategy } from './ProximitySortStrategy';

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Implementação client-side enquanto o postoradar-geo (serviço do Victor)
 * não existe. Não depende de rede — calcula sobre os postos já retornados
 * por GET /postos (que já incluem latitude/longitude).
 */
export const haversineStrategy: ProximitySortStrategy = {
  async sortByProximity(userLocation, items) {
    return items
      .map((item) => ({ ...item, distanceKm: haversineKm(userLocation, item) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  },
};
