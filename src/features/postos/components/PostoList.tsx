import type { PostoComDistancia } from '../hooks/useProximitySortedPostos';
import type { Combustivel, Posto } from '../types/postos.types';
import { PostoCard } from './PostoCard';

interface PostoListProps {
  postos: Array<Posto | PostoComDistancia>;
  combustivelFiltrado?: Combustivel;
  distanciaPorId?: Map<string, number>;
}

export function PostoList({ postos, combustivelFiltrado, distanciaPorId }: PostoListProps) {
  return (
    <div className="results-panel">
      <div className="results-panel-header">
        <span className="results-count">
          {postos.length} {postos.length === 1 ? 'posto encontrado' : 'postos encontrados'}
        </span>
      </div>
      {postos.length === 0 ? (
        <div className="results-empty">Nenhum posto encontrado com esses filtros.</div>
      ) : (
        <div className="results-list">
          {postos.map((posto, i) => (
            <PostoCard
              key={posto.id}
              posto={posto}
              rank={i + 1}
              combustivelFiltrado={combustivelFiltrado}
              distanciaKm={
                distanciaPorId?.get(posto.id) ??
                ('distanceKm' in posto ? posto.distanceKm : undefined)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
