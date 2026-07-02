import type { PostoComDistancia } from '../hooks/useProximitySortedPostos';
import type { Posto } from '../types/postos.types';
import { PostoCard } from './PostoCard';

export function PostoList({ postos }: { postos: Array<Posto | PostoComDistancia> }) {
  if (postos.length === 0) {
    return <p className="muted">Nenhum posto encontrado.</p>;
  }

  return (
    <div>
      {postos.map((posto) => (
        <PostoCard key={posto.id} posto={posto} />
      ))}
    </div>
  );
}
