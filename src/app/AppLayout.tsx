import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

export function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <Link to="/" style={{ fontWeight: 600, textDecoration: 'none', color: 'var(--text)' }}>
          PostoRadar
        </Link>
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/postos/novo">Cadastrar posto</Link>
              <span className="muted">{user?.name}</span>
              <button className="btn btn-secondary" onClick={() => void logout()}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/cadastro">Cadastrar</Link>
            </>
          )}
        </nav>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
