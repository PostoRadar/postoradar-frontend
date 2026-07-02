import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../../../shared/api/httpError';
import { Button } from '../../../shared/components/Button';
import { ErrorBanner } from '../../../shared/components/ErrorBanner';
import { FormField } from '../../../shared/components/FormField';
import { useAuth } from '../context/AuthContext';
import { registerFormSchema, type RegisterFormInput } from '../schemas/auth.schemas';

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerFormSchema) });

  const onSubmit = async (data: RegisterFormInput) => {
    setFormError(null);
    try {
      await registerUser(data);
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length > 0) {
        for (const fe of err.fieldErrors) {
          setError(fe.campo as keyof RegisterFormInput, { message: fe.mensagem });
        }
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('Não foi possível criar a conta. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <ErrorBanner message={formError} />}
      <FormField label="Nome" error={errors.name?.message} {...register('name')} />
      <FormField label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
      <FormField label="Senha" type="password" error={errors.password?.message} {...register('password')} />
      <Button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </Button>
      <p className="muted" style={{ marginTop: 12 }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </form>
  );
}
