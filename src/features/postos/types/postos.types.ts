// Espelha o enum Combustivel de postoradar-api/prisma/schema.prisma. Tupla
// `as const` para preservar os literais tanto no tipo quanto no z.enum().
export const COMBUSTIVEL_VALUES = [
  'GASOLINA_COMUM',
  'GASOLINA_ADITIVADA',
  'ETANOL',
  'DIESEL',
  'DIESEL_S10',
  'GNV',
] as const;

export type Combustivel = (typeof COMBUSTIVEL_VALUES)[number];

export interface Preco {
  id: string;
  postoId: string;
  combustivel: Combustivel;
  // O Prisma serializa campos Decimal como STRING no JSON (decimal.js
  // implementa toJSON() -> toString()), mesmo o schema sendo numérico no
  // banco. Sempre passar por Number(preco.valor) antes de somar/ordenar.
  valor: string;
  reportadoPor: string;
  atualizadoEm: string;
}

export interface Posto {
  id: string;
  nome: string;
  bandeira: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string | null;
  latitude: number;
  longitude: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  precos: Preco[];
}

export type OrdenarPor = 'recentes' | 'preco';

export interface ListarPostosFiltros {
  cidade?: string;
  bandeira?: string;
  combustivel?: Combustivel;
  ordenarPor?: OrdenarPor;
}
