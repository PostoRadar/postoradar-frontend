import { useQuery } from '@tanstack/react-query';
import * as historicoApi from './historico.api';

export function useHistoricoQuery(postoId: string | undefined) {
  return useQuery({
    queryKey: ['historico', postoId],
    queryFn: () => historicoApi.buscarHistorico(postoId as string),
    enabled: Boolean(postoId),
  });
}
