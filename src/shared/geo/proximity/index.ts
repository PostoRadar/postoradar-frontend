import { haversineStrategy } from './haversineStrategy';
import type { ProximitySortStrategy } from './ProximitySortStrategy';

export type { Coordinates, ProximitySortStrategy } from './ProximitySortStrategy';

// Ponto único de troca: quando o postoradar-geo existir, troque para
// `remoteGeoStrategy` aqui (ou controle por env var) — nenhuma tela consome
// haversineStrategy/remoteGeoStrategy diretamente, só esta constante.
export const activeProximityStrategy: ProximitySortStrategy = haversineStrategy;
