import { Link } from 'react-router-dom';
import { formatBRL } from '../../../shared/utils/currency';
import type { PostoComDistancia } from '../hooks/useProximitySortedPostos';
import type { Posto } from '../types/postos.types';

export function PostoCard({ posto }: { posto: Posto | PostoComDistancia }) {
  const menorPreco = posto.precos.length
    ? Math.min(...posto.precos.map((p) => Number(p.valor)))
    : null;
  const distanceKm = 'distanceKm' in posto ? posto.distanceKm : null;

  return (
    <Link to={`/postos/${posto.id}`} className="posto-card">
      <div className="posto-card-top">
        <h3 className="posto-card-name">{posto.nome}</h3>
        {distanceKm !== null && <span className="posto-card-distance">📍 {distanceKm.toFixed(1)} km</span>}
      </div>
      <p className="posto-card-meta">
        {posto.bandeira} · {posto.bairro}, {posto.cidade}
      </p>
      <div className="posto-card-bottom">
        {menorPreco !== null ? (
          <>
            <span className="muted">A partir de</span>
            <span className="posto-card-price">{formatBRL(menorPreco)}</span>
          </>
        ) : (
          <span className="muted">Sem preços cadastrados</span>
        )}
      </div>
    </Link>
  );
}
