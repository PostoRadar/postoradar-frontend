import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { formatBRL } from '../../../shared/utils/currency';
import type { Posto } from '../../postos/types/postos.types';
import { postoIcon } from '../markerIcons';

export function PostoMarker({ posto, rank }: { posto: Posto; rank: number }) {
  const menorPreco = posto.precos.length
    ? Math.min(...posto.precos.map((p) => Number(p.valor)))
    : null;

  // Ícone estável: só recriado quando o número muda, evitando setIcon a cada
  // re-render (o Leaflet reclama ao receber um ícone novo desnecessariamente).
  const icon = useMemo(() => postoIcon(rank), [rank]);

  return (
    <Marker position={[posto.latitude, posto.longitude]} icon={icon}>
      <Popup>
        <strong>{posto.nome}</strong>
        <br />
        {posto.bandeira} · {posto.bairro}
        <br />
        {menorPreco !== null ? (
          <>
            A partir de <span className="price-tag">{formatBRL(menorPreco)}</span>
          </>
        ) : (
          'Sem preços cadastrados'
        )}
        <br />
        <Link to={`/postos/${posto.id}`}>Ver detalhes</Link>
      </Popup>
    </Marker>
  );
}
