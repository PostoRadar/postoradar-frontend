import L from 'leaflet';

// Ícone customizado do posto: uma "bola de radar" nas cores da marca, com um
// anel pulsante — substitui o pin padrão do Leaflet (fix de ícone quebrado
// deixou de ser necessário, já que nenhum marker usa mais o ícone default).
export const postoIcon = L.divIcon({
  className: 'posto-marker-icon',
  html: '<span class="posto-pin-wrap"><span class="posto-pin-ring"></span><span class="posto-pin"></span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -18],
});

// Ponto azul neutro (convenção comum de "você está aqui"), deliberadamente
// fora da paleta da marca para não ser confundido com um posto no mapa.
export const userLocationIcon = L.divIcon({
  className: 'user-marker-icon',
  html: '<span class="user-pin"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
