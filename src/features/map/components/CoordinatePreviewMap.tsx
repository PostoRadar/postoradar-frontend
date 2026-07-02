import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { postoIcon } from '../markerIcons';

function RecenterOnChange({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);

  return null;
}

interface CoordinatePreviewMapProps {
  latitude: number;
  longitude: number;
}

/**
 * Prévia visual da lat/lon digitada no formulário de cadastro de posto —
 * pega erros de digitação (ex.: trocar "-34" por "-35") antes de salvar,
 * quando o pino aparece longe do endereço informado.
 */
export function CoordinatePreviewMap({ latitude, longitude }: CoordinatePreviewMapProps) {
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        height: 200,
        marginBottom: 16,
      }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={postoIcon} />
        <RecenterOnChange lat={latitude} lon={longitude} />
      </MapContainer>
    </div>
  );
}
