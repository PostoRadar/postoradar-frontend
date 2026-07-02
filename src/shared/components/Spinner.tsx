export function Spinner({ label = 'Carregando...' }: { label?: string }) {
  return <p className="muted">{label}</p>;
}
