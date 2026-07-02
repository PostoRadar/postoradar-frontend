import { apiClient } from '../../../shared/api/apiClient';
import { toApiError } from '../../../shared/api/httpError';
import type { AtualizarPrecoInput, CriarPostoInput } from '../schemas/postos.schemas';
import type { ListarPostosFiltros, Posto, Preco } from '../types/postos.types';

export async function listarPostos(filtros: ListarPostosFiltros): Promise<Posto[]> {
  try {
    const { data } = await apiClient.get<Posto[]>('/postos', { params: filtros });
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function buscarPosto(id: string): Promise<Posto> {
  try {
    const { data } = await apiClient.get<Posto>(`/postos/${id}`);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function listarPrecos(postoId: string): Promise<Preco[]> {
  try {
    const { data } = await apiClient.get<Preco[]>(`/postos/${postoId}/precos`);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function atualizarPreco(postoId: string, input: AtualizarPrecoInput): Promise<Preco> {
  try {
    const { data } = await apiClient.put<Preco>(`/postos/${postoId}/precos`, input);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function criarPosto(input: CriarPostoInput): Promise<Posto> {
  try {
    const { data } = await apiClient.post<Posto>('/postos', input);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}
