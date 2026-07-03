// Espelha o contrato de GET /postos/:id/historico do postoradar-history.
export interface RegistroHistorico {
  id: string;
  postoId: string;
  postoNome: string;
  bairro: string;
  cidade: string;
  tipoCombustivel: string;
  // Nulo no primeiro registro conhecido daquele posto+combustível.
  precoAntigo: number | null;
  precoNovo: number;
  autorId: string;
  registradoEm: string; // ISO 8601
}

export interface HistoricoResponse {
  postoId: string;
  limite: number;
  registros: RegistroHistorico[];
}
