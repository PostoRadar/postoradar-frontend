import { historyClient } from '../../../shared/api/historyClient';
import { toApiError } from '../../../shared/api/httpError';
import type { HistoricoResponse, RegistroHistorico } from '../types/historico.types';

export async function buscarHistorico(postoId: string, limite = 20): Promise<RegistroHistorico[]> {
  try {
    const { data } = await historyClient.get<HistoricoResponse>(
      `/postos/${postoId}/historico`,
      { params: { limite } },
    );
    return data.registros;
  } catch (err) {
    throw toApiError(err);
  }
}
