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
    <Link
      to={`/postos/${posto.id}`}
      className="card"
      style={{ display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: 12 }}
    >
      <h3 style={{ marginBottom: 4 }}>{posto.nome}</h3>
      <p className="muted">
        {posto.bandeira} · {posto.bairro}, {posto.cidade}
      </p>
      <p style={{ marginTop: 8 }}>
        {menorPreco !== null ? `A partir de ${formatBRL(menorPreco)}` : 'Sem preços cadastrados'}
        {distanceKm !== null && ` · ${distanceKm.toFixed(1)} km`}
      </p>
    </Link>
  );
}
