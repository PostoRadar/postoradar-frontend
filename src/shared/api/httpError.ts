import { AxiosError } from 'axios';

export interface FieldError {
  campo: string;
  mensagem: string;
}

interface BackendErrorBody {
  error: {
    code: string;
    message: string;
    // `details` não tem um shape único: em erros de validação Zod é
    // FieldError[], mas HttpErrors específicos (ex.: posto_duplicado) podem
    // mandar outros objetos (ver `details` em ApiError).
    details?: unknown;
  };
}

/**
 * Normaliza o shape de erro do backend ({error:{code,message,details}},
 * compartilhado por postoradar-api e postoradar-auth) para uso na UI.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly details: unknown;
  readonly fieldErrors: FieldError[];
  readonly status?: number;

  constructor(message: string, code: string, details?: unknown, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.fieldErrors = Array.isArray(details) ? (details as FieldError[]) : [];
    this.status = status;
  }
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const body = err.response?.data as BackendErrorBody | undefined;
    if (body?.error) {
      return new ApiError(body.error.message, body.error.code, body.error.details, err.response?.status);
    }
    return new ApiError(err.message, 'network_error', undefined, err.response?.status);
  }
  if (err instanceof Error) {
    return new ApiError(err.message, 'unknown_error');
  }
  return new ApiError('Erro desconhecido', 'unknown_error');
}
