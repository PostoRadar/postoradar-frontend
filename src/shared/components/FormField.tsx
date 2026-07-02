import type { InputHTMLAttributes, ReactNode } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  children?: ReactNode;
}

/**
 * Wrapper de label+input+erro para uso com react-hook-form (spread de
 * `register(...)` em `...rest`). Quando `children` é passado, renderiza-o no
 * lugar do <input> (ex.: um <select>), mantendo label/erro consistentes.
 */
export function FormField({ label, error, children, id, ...rest }: FormFieldProps) {
  const fieldId = id ?? rest.name;
  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      {children ?? <input id={fieldId} {...rest} />}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
