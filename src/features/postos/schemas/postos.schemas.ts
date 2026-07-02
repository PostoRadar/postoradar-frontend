import { z } from 'zod';
import { PRECO_MAXIMO, PRECO_MINIMO } from '../../../shared/utils/currency';
import { COMBUSTIVEL_VALUES } from '../types/postos.types';

// Espelha postos.validators.ts de postoradar-api. O backend segue sendo a
// fonte de verdade; isto é validação "cedo" no client.
const combustivelSchema = z.enum(COMBUSTIVEL_VALUES);

const precoItemSchema = z.object({
  combustivel: combustivelSchema,
  valor: z
    .number({ error: 'Informe um preço válido' })
    .min(PRECO_MINIMO, `O preço deve ser de no mínimo R$ ${PRECO_MINIMO.toFixed(2)}`)
    .max(PRECO_MAXIMO, `O preço deve ser de no máximo R$ ${PRECO_MAXIMO.toFixed(2)}`),
});

export const atualizarPrecoFormSchema = precoItemSchema;

export type AtualizarPrecoInput = z.infer<typeof atualizarPrecoFormSchema>;
