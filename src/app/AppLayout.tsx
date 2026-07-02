import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { Logo } from '../shared/components/Logo';

export function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Logo size={24} />
          <Link to="/buscar" className="muted" style={{ textDecoration: 'none', fontWeight: 500 }}>
            Buscar postos
          </Link>
        </div>
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/postos/novo" className="muted" style={{ textDecoration: 'none', fontWeight: 500 }}>
                Cadastrar posto
              </Link>
              <span className="badge">{user?.name}</span>
              <button className="btn btn-secondary" onClick={() => void logout()}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="muted" style={{ textDecoration: 'none', fontWeight: 500 }}>
                Entrar
              </Link>
              <Link to="/cadastro" className="btn">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </header>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
