import L from 'leaflet';

// Cache de ícones por número: ícones do Leaflet são imutáveis e reutilizáveis,
// então guardamos uma instância por rank. Isso mantém a MESMA referência entre
// remounts (ex.: o double-invoke do StrictMode em dev), evitando que o
// react-leaflet chame setIcon à toa — o que dispararia o erro conhecido
// "options.icon.createIcon is not a function".
const iconCache = new Map<number, L.DivIcon>();

// Ícone customizado do posto: uma "bola de radar" numerada nas cores da marca,
// com um anel pulsante. O número correlaciona o marcador com o card na lista
// de resultados (mesma ordem). Sem número (rank ausente) para marcador avulso.
export function postoIcon(rank?: number): L.DivIcon {
  const chave = rank ?? -1;
  const emCache = iconCache.get(chave);
  if (emCache) return emCache;

  const numero = rank !== undefined ? String(rank) : '';
  const icon = L.divIcon({
    className: 'posto-marker-icon',
    html: `<span class="posto-pin-wrap"><span class="posto-pin-ring"></span><span class="posto-pin">${numero}</span></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
  iconCache.set(chave, icon);
  return icon;
}

// Ponto azul neutro (convenção comum de "você está aqui"), deliberadamente
// fora da paleta da marca para não ser confundido com um posto no mapa.
export const userLocationIcon = L.divIcon({
  className: 'user-marker-icon',
  html: '<span class="user-pin"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
