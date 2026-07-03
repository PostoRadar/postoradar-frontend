import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { Logo } from '../shared/components/Logo';

export function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <Logo size={24} />
          <Link to="/buscar" className="nav-link">
            Buscar postos
          </Link>
        </div>
        <nav className="app-nav">
          {isAuthenticated ? (
            <>
              <Link to="/postos/novo" className="nav-link">
                Cadastrar posto
              </Link>
              <span className="badge badge-user">{user?.name}</span>
              <button className="btn btn-secondary" onClick={() => void logout()}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
