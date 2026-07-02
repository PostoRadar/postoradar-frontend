import type { ProximitySortStrategy } from './ProximitySortStrategy';

/**
 * Stub para quando o postoradar-geo (serviço do Victor) existir. Troca-se
 * a implementação ativa só em `index.ts` — nenhuma tela precisa mudar.
 * Implementação futura provavelmente chama `POST /geo/ordenar` (ver
 * postoradar-infra/docs/04-planejamento.md) em vez de calcular localmente.
 */
export const remoteGeoStrategy: ProximitySortStrategy = {
  async sortByProximity() {
    throw new Error('remoteGeoStrategy ainda não implementada — postoradar-geo não existe.');
  },
};
