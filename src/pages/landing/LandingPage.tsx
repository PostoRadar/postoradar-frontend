import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">
          <span className="logo-posto">Posto</span>
          <span className="logo-radar">Radar</span>
        </h1>
        <p className="hero-subtitle">
          Encontre o combustível mais barato perto de você e ajude a manter os preços sempre
          atualizados — em tempo real, com a colaboração da própria comunidade.
        </p>
        <div className="hero-actions">
          <Link to="/buscar" className="btn">
            Ver postos no mapa
          </Link>
          {!isAuthenticated && (
            <Link to="/cadastro" className="btn btn-outline-brand">
              Criar conta
            </Link>
          )}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Como funciona</h2>
        <p className="section-subtitle">
          Um sistema colaborativo: você consulta, e quem passou no posto agora há pouco garante
          que o preço está certo.
        </p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon feature-icon-radar">📍</div>
            <h3>Perto de você</h3>
            <p className="muted">
              Veja no mapa os postos mais próximos, ordenados por distância ou pelo menor preço.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon-posto">⛽</div>
            <h3>Preços atualizados</h3>
            <p className="muted">
              Gasolina, etanol, diesel e GNV — cada preço mostra quando foi reportado pela última
              vez.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon-radar">🤝</div>
            <h3>Comunidade</h3>
            <p className="muted">
              Chegou no posto e o preço mudou? Atualize na hora e ajude quem vem depois de você.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
