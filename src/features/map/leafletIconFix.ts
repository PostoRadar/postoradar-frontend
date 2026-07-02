import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// O bundler (Vite) reescreve os paths dos ícones padrão do Leaflet; sem isso,
// os pins do mapa ficam quebrados (ícone ausente). Aplicado uma única vez.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,
});
