import { authClient } from '../../../shared/api/authClient';
import { toApiError } from '../../../shared/api/httpError';
import type { LoginFormInput, RegisterFormInput } from '../schemas/auth.schemas';
import type { AuthResult, User } from '../types/auth.types';

export async function register(input: RegisterFormInput): Promise<AuthResult> {
  try {
    const { data } = await authClient.post<AuthResult>('/auth/register', input);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function login(input: LoginFormInput): Promise<AuthResult> {
  try {
    const { data } = await authClient.post<AuthResult>('/auth/login', input);
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    await authClient.post('/auth/logout', { refreshToken });
  } catch (err) {
    throw toApiError(err);
  }
}

export async function me(accessToken: string): Promise<User> {
  try {
    const { data } = await authClient.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}
