import { useQuery } from '@tanstack/react-query';
import * as postosApi from './postos.api';
import type { ListarPostosFiltros } from '../types/postos.types';

export function usePostosQuery(filtros: ListarPostosFiltros) {
  return useQuery({
    queryKey: ['postos', filtros],
    queryFn: () => postosApi.listarPostos(filtros),
  });
}

export function usePostoQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['postos', id],
    queryFn: () => postosApi.buscarPosto(id as string),
    enabled: Boolean(id),
  });
}
