import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, type Location } from 'react-router-dom';
import { ApiError } from '../../../shared/api/httpError';
import { Button } from '../../../shared/components/Button';
import { ErrorBanner } from '../../../shared/components/ErrorBanner';
import { FormField } from '../../../shared/components/FormField';
import { useAuth } from '../context/AuthContext';
import { loginFormSchema, type LoginFormInput } from '../schemas/auth.schemas';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({ resolver: zodResolver(loginFormSchema) });

  const onSubmit = async (data: LoginFormInput) => {
    setFormError(null);
    try {
      await login(data);
      const from = (location.state as { from?: Location } | null)?.from;
      navigate(from ? `${from.pathname}${from.search}` : '/', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length > 0) {
        for (const fe of err.fieldErrors) {
          setError(fe.campo as keyof LoginFormInput, { message: fe.mensagem });
        }
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('Não foi possível entrar. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <ErrorBanner message={formError} />}
      <FormField label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
      <FormField label="Senha" type="password" error={errors.password?.message} {...register('password')} />
      <Button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
      <p className="muted" style={{ marginTop: 12 }}>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </form>
  );
}
