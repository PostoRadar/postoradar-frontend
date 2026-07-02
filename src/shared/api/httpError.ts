import { AxiosError } from 'axios';

export interface FieldError {
  campo: string;
  mensagem: string;
}

interface BackendErrorBody {
  error: {
    code: string;
    message: string;
    details?: FieldError[];
  };
}

/**
 * Normaliza o shape de erro do backend ({error:{code,message,details}},
 * compartilhado por postoradar-api e postoradar-auth) para uso na UI.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly fieldErrors: FieldError[];
  readonly status?: number;

  constructor(message: string, code: string, fieldErrors: FieldError[] = [], status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const body = err.response?.data as BackendErrorBody | undefined;
    if (body?.error) {
      return new ApiError(
        body.error.message,
        body.error.code,
        body.error.details ?? [],
        err.response?.status,
      );
    }
    return new ApiError(err.message, 'network_error', [], err.response?.status);
  }
  if (err instanceof Error) {
    return new ApiError(err.message, 'unknown_error');
  }
  return new ApiError('Erro desconhecido', 'unknown_error');
}
