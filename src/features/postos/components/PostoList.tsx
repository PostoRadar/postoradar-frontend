import type { PostoComDistancia } from '../hooks/useProximitySortedPostos';
import type { Posto } from '../types/postos.types';
import { PostoCard } from './PostoCard';

export function PostoList({ postos }: { postos: Array<Posto | PostoComDistancia> }) {
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
          {postos.map((posto) => (
            <PostoCard key={posto.id} posto={posto} />
          ))}
        </div>
      )}
    </div>
  );
}
