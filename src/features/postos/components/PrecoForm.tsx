import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError } from '../../../shared/api/httpError';
import { Button } from '../../../shared/components/Button';
import { ErrorBanner } from '../../../shared/components/ErrorBanner';
import { FormField } from '../../../shared/components/FormField';
import { COMBUSTIVEL_LABELS, COMBUSTIVEL_OPTIONS } from '../../../shared/utils/enums';
import { useAtualizarPrecoMutation } from '../api/postos.queries';
import { atualizarPrecoFormSchema, type AtualizarPrecoInput } from '../schemas/postos.schemas';

export function PrecoForm({ postoId, onSuccess }: { postoId: string; onSuccess?: () => void }) {
  const mutation = useAtualizarPrecoMutation(postoId);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AtualizarPrecoInput>({
    resolver: zodResolver(atualizarPrecoFormSchema),
    defaultValues: { combustivel: COMBUSTIVEL_OPTIONS[0], valor: undefined },
  });

  const onSubmit = async (data: AtualizarPrecoInput) => {
    setFormError(null);
    try {
      await mutation.mutateAsync(data);
      reset({ combustivel: data.combustivel, valor: undefined });
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length > 0) {
        for (const fe of err.fieldErrors) {
          setError(fe.campo as keyof AtualizarPrecoInput, { message: fe.mensagem });
        }
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('Não foi possível atualizar o preço. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <ErrorBanner message={formError} />}
      <div className="form-grid-2">
        <FormField label="Combustível" error={errors.combustivel?.message}>
          <select id="combustivel" {...register('combustivel')}>
            {COMBUSTIVEL_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {COMBUSTIVEL_LABELS[c]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Novo preço (R$)"
          type="number"
          step="0.01"
          min={1}
          max={15}
          placeholder="0,00"
          error={errors.valor?.message}
          {...register('valor', { valueAsNumber: true })}
        />
      </div>
      <Button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
        {isSubmitting ? 'Atualizando...' : 'Atualizar preço'}
      </Button>
    </form>
  );
}
