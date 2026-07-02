import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as postosApi from './postos.api';
import type { AtualizarPrecoInput, CriarPostoInput } from '../schemas/postos.schemas';
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

export function useAtualizarPrecoMutation(postoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AtualizarPrecoInput) => postosApi.atualizarPreco(postoId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postos'] });
      queryClient.invalidateQueries({ queryKey: ['postos', postoId] });
    },
  });
}

export function useCriarPostoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CriarPostoInput) => postosApi.criarPosto(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postos'] });
    },
  });
}
