import { COMBUSTIVEL_VALUES, type Combustivel } from '../../features/postos/types/postos.types';

export const COMBUSTIVEL_LABELS: Record<Combustivel, string> = {
  GASOLINA_COMUM: 'Gasolina Comum',
  GASOLINA_ADITIVADA: 'Gasolina Aditivada',
  ETANOL: 'Etanol',
  DIESEL: 'Diesel',
  DIESEL_S10: 'Diesel S10',
  GNV: 'GNV',
};

export const COMBUSTIVEL_OPTIONS: Combustivel[] = [...COMBUSTIVEL_VALUES];
