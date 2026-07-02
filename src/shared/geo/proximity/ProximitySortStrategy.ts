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
   * Assíncrono mesmo na implementação atual (Haversine, 100% client-side e
   * síncrona por natureza) para já ficar compatível com uma futura estratégia
   * que consulte o serviço remoto `postoradar-geo` sem quebrar a assinatura.
   */
  sortByProximity<T extends Coordinates>(
    userLocation: Coordinates,
    items: T[],
  ): Promise<Array<T & { distanceKm: number }>>;
}
