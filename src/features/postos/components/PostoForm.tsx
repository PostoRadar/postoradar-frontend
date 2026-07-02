import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../../../shared/api/httpError';
import { Button } from '../../../shared/components/Button';
import { ErrorBanner } from '../../../shared/components/ErrorBanner';
import { FormField } from '../../../shared/components/FormField';
import { useUserLocation } from '../../../shared/geo/context/GeoLocationContext';
import { COMBUSTIVEL_LABELS, COMBUSTIVEL_OPTIONS } from '../../../shared/utils/enums';
import { CoordinatePreviewMap } from '../../map/components/CoordinatePreviewMap';
import { useCriarPostoMutation } from '../api/postos.queries';
import { criarPostoFormSchema, type CriarPostoInput } from '../schemas/postos.schemas';

export function PostoForm() {
  const mutation = useCriarPostoMutation();
  const navigate = useNavigate();
  const { location: userLocation, requestLocation, status } = useUserLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CriarPostoInput>({
    resolver: zodResolver(criarPostoFormSchema),
    defaultValues: { precos: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'precos' });

  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const temCoordenadasValidas = Number.isFinite(latitude) && Number.isFinite(longitude);

  const usarMinhaLocalizacao = () => {
    if (userLocation) {
      setValue('latitude', userLocation.latitude);
      setValue('longitude', userLocation.longitude);
    } else {
      requestLocation();
    }
  };

  const onSubmit = async (data: CriarPostoInput) => {
    setFormError(null);
    try {
      // Input HTML sempre manda '' para o CEP vazio; o backend só aceita o
      // campo ausente ou casando o regex, nunca string vazia.
      const posto = await mutation.mutateAsync({ ...data, cep: data.cep || undefined });
      navigate(`/postos/${posto.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length > 0) {
        for (const fe of err.fieldErrors) {
          setError(fe.campo as keyof CriarPostoInput, { message: fe.mensagem });
        }
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('Não foi possível cadastrar o posto. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <ErrorBanner message={formError} />}
      <FormField label="Nome do posto" error={errors.nome?.message} {...register('nome')} />
      <FormField label="Bandeira" error={errors.bandeira?.message} {...register('bandeira')} />
      <FormField label="Endereço" error={errors.endereco?.message} {...register('endereco')} />
      <FormField label="Bairro" error={errors.bairro?.message} {...register('bairro')} />
      <FormField label="Cidade" error={errors.cidade?.message} {...register('cidade')} />
      <FormField label="Estado (UF)" maxLength={2} error={errors.estado?.message} {...register('estado')} />
      <FormField label="CEP (opcional)" error={errors.cep?.message} {...register('cep')} />

      <div style={{ display: 'flex', gap: 12 }}>
        <FormField
          label="Latitude"
          type="number"
          step="any"
          error={errors.latitude?.message}
          {...register('latitude', { valueAsNumber: true })}
        />
        <FormField
          label="Longitude"
          type="number"
          step="any"
          error={errors.longitude?.message}
          {...register('longitude', { valueAsNumber: true })}
        />
      </div>
      <Button type="button" variant="secondary" onClick={usarMinhaLocalizacao} style={{ marginBottom: 16 }}>
        {status === 'loading' ? 'Obtendo localização...' : 'Usar minha localização'}
      </Button>

      {temCoordenadasValidas && (
        <>
          <p className="muted" style={{ marginBottom: 8 }}>
            Confira se o pino está no lugar certo antes de salvar:
          </p>
          <CoordinatePreviewMap latitude={latitude} longitude={longitude} />
        </>
      )}

      <h3>Preços iniciais (opcional)</h3>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <FormField label="Combustível" error={errors.precos?.[index]?.combustivel?.message}>
            <select {...register(`precos.${index}.combustivel` as const)}>
              {COMBUSTIVEL_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {COMBUSTIVEL_LABELS[c]}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Preço (R$)"
            type="number"
            step="0.01"
            error={errors.precos?.[index]?.valor?.message}
            {...register(`precos.${index}.valor` as const, { valueAsNumber: true })}
          />
          <Button type="button" variant="secondary" onClick={() => remove(index)} style={{ marginBottom: 16 }}>
            Remover
          </Button>
        </div>
      ))}
      {errors.precos?.root && <span className="field-error">{errors.precos.root.message}</span>}
      <Button
        type="button"
        variant="secondary"
        onClick={() => append({ combustivel: COMBUSTIVEL_OPTIONS[0], valor: 0 })}
        disabled={fields.length >= 6}
        style={{ marginBottom: 24 }}
      >
        + Adicionar preço
      </Button>

      <Button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar posto'}
      </Button>
    </form>
  );
}
