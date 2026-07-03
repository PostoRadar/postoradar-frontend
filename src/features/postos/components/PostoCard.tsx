import { Link } from 'react-router-dom';
import { formatBRL } from '../../../shared/utils/currency';
import { COMBUSTIVEL_LABELS } from '../../../shared/utils/enums';
import type { PostoComDistancia } from '../hooks/useProximitySortedPostos';
import type { Combustivel, Posto } from '../types/postos.types';

interface PostoCardProps {
  posto: Posto | PostoComDistancia;
  // Quando o usuário filtra por um combustível, mostra o preço dele
  // especificamente em vez do menor preço entre todos os combustíveis.
  combustivelFiltrado?: Combustivel;
}

export function PostoCard({ posto, combustivelFiltrado }: PostoCardProps) {
  const precoFiltrado = combustivelFiltrado
    ? posto.precos.find((p) => p.combustivel === combustivelFiltrado)
    : undefined;
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
        {precoFiltrado ? (
          <>
            <span className="muted">{COMBUSTIVEL_LABELS[combustivelFiltrado as Combustivel]}</span>
            <span className="posto-card-price">{formatBRL(Number(precoFiltrado.valor))}</span>
          </>
        ) : menorPreco !== null ? (
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
