export function Spinner({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      {label}
    </div>
  );
}
