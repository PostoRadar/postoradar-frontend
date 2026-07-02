export const PRECO_MINIMO = 1;
export const PRECO_MAXIMO = 15;

export function formatBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
