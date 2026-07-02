export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ProximitySortStrategy {
  /**
   * Recebe a localização do usuário e uma lista de itens com coordenadas
   * (hoje: postos já carregados via GET /postos), retorna a mesma lista
   * ordenada por proximidade (mais perto primeiro) com `distanceKm` anexado.
   *
   * Exige `id` porque a estratégia remota (postoradar-geo) correlaciona a
   * resposta do serviço pelo id do posto, não pela ordem do array.
   */
  sortByProximity<T extends Coordinates & { id: string }>(
    userLocation: Coordinates,
    items: T[],
  ): Promise<Array<T & { distanceKm: number }>>;
}
