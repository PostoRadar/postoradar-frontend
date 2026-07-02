import { z } from 'zod';

// Espelha registerSchema/loginSchema de postoradar-auth/src/modules/auth/auth.validators.ts.
// O backend continua sendo a fonte de verdade; isto é só validação "cedo" no client.
export const registerFormSchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter ao menos 3 caracteres').max(120),
  email: z.string().trim().toLowerCase().email('E-mail inválido').max(180),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres').max(72),
});

export const loginFormSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

export type RegisterFormInput = z.infer<typeof registerFormSchema>;
export type LoginFormInput = z.infer<typeof loginFormSchema>;
