import { Link } from 'react-router-dom';

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <Link to="/" className="logo" style={{ fontSize: size }}>
      <span className="logo-posto">Posto</span>
      <span className="logo-radar">Radar</span>
    </Link>
  );
}
