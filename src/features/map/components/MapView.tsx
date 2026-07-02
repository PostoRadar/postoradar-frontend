import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import '../leafletIconFix';
import type { Coordinates } from '../../../shared/geo/proximity';
import type { Posto } from '../../postos/types/postos.types';
import { PostoMarker } from './PostoMarker';

// Recife como fallback: postos ainda não têm filtro de estado/país, mas o
// dataset do time é local (UFRPE). Ajustável sem impacto no resto do app.
const DEFAULT_CENTER: Coordinates = { latitude: -8.0476, longitude: -34.877 };
const DEFAULT_ZOOM = 12;

interface MapViewProps {
  postos: Posto[];
  userLocation?: Coordinates | null;
}

export function MapView({ postos, userLocation }: MapViewProps) {
  const center = userLocation ?? DEFAULT_CENTER;

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%', minHeight: 360 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && <Marker position={[userLocation.latitude, userLocation.longitude]} />}
      {postos.map((posto) => (
        <PostoMarker key={posto.id} posto={posto} />
      ))}
    </MapContainer>
  );
}
