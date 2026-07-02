import { remoteGeoStrategy } from './remoteGeoStrategy';
import type { ProximitySortStrategy } from './ProximitySortStrategy';

export type { Coordinates, ProximitySortStrategy } from './ProximitySortStrategy';

// Ponto único de troca: nenhuma tela consome haversineStrategy/remoteGeoStrategy
// diretamente, só esta constante. remoteGeoStrategy já cai para o cálculo
// local (haversineStrategy) se o postoradar-geo estiver indisponível.
export const activeProximityStrategy: ProximitySortStrategy = remoteGeoStrategy;
