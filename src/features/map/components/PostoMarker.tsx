import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { formatBRL } from '../../../shared/utils/currency';
import type { Posto } from '../../postos/types/postos.types';

export function PostoMarker({ posto }: { posto: Posto }) {
  const menorPreco = posto.precos.length
    ? Math.min(...posto.precos.map((p) => Number(p.valor)))
    : null;

  return (
    <Marker position={[posto.latitude, posto.longitude]}>
      <Popup>
        <strong>{posto.nome}</strong>
        <br />
        {posto.bandeira} · {posto.bairro}
        <br />
        {menorPreco !== null ? `A partir de ${formatBRL(menorPreco)}` : 'Sem preços cadastrados'}
        <br />
        <Link to={`/postos/${posto.id}`}>Ver detalhes</Link>
      </Popup>
    </Marker>
  );
}
