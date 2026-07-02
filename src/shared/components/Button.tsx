import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const variantClass = variant === 'secondary' ? 'btn btn-secondary' : 'btn';
  return <button className={className ? `${variantClass} ${className}` : variantClass} {...rest} />;
}
