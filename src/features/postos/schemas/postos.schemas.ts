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

export const criarPostoFormSchema = z
  .object({
    nome: z.string().trim().min(2, 'O nome do posto é obrigatório').max(160),
    bandeira: z.string().trim().min(2, 'A bandeira é obrigatória').max(80),
    endereco: z.string().trim().min(3, 'O endereço é obrigatório').max(240),
    bairro: z.string().trim().min(2, 'O bairro é obrigatório').max(120),
    cidade: z.string().trim().min(2, 'A cidade é obrigatória').max(120),
    estado: z
      .string()
      .trim()
      .length(2, 'O estado deve ser a sigla da UF (2 letras)')
      .transform((v) => v.toUpperCase()),
    // Input HTML sempre manda string ('' quando vazio, nunca undefined) — em
    // vez de unir com z.literal(''), tratamos vazio como "não informado"
    // diretamente no refine.
    cep: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^\d{5}-?\d{3}$/.test(v), 'CEP inválido'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    precos: z.array(precoItemSchema).max(6).optional(),
  })
  .refine(
    (data) => {
      if (!data.precos) return true;
      const tipos = data.precos.map((p) => p.combustivel);
      return new Set(tipos).size === tipos.length;
    },
    { message: 'Há combustível repetido na lista de preços iniciais', path: ['precos'] },
  );

export const atualizarPrecoFormSchema = precoItemSchema;

export type CriarPostoInput = z.infer<typeof criarPostoFormSchema>;
export type AtualizarPrecoInput = z.infer<typeof atualizarPrecoFormSchema>;
