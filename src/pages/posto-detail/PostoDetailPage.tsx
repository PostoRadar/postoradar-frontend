import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { usePostoQuery } from '../../features/postos/api/postos.queries';
import { PrecoForm } from '../../features/postos/components/PrecoForm';
import { HistoricoPrecos } from '../../features/historico/components/HistoricoPrecos';
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import { Spinner } from '../../shared/components/Spinner';
import { formatBRL } from '../../shared/utils/currency';
import { COMBUSTIVEL_LABELS } from '../../shared/utils/enums';

export function PostoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { data: posto, isLoading, isError, error } = usePostoQuery(id);

  if (isLoading) {
    return <Spinner label="Carregando posto..." />;
  }

  if (isError) {
    return (
      <div className="detail-shell">
        <ErrorBanner message={error instanceof Error ? error.message : 'Erro ao carregar posto.'} />
      </div>
    );
  }

  if (!posto) {
    return null;
  }

  return (
    <div className="detail-shell">
      <Link to="/buscar" className="back-link">
        ← Voltar pra busca
      </Link>

      <span className="badge">{posto.bandeira}</span>
      <h1 className="detail-hero-title">{posto.nome}</h1>
      <p className="detail-address">
        📍 {posto.endereco}, {posto.bairro} — {posto.cidade}/{posto.estado}
      </p>

      <div className="detail-grid">
        <section className="card">
          <h2>Preços</h2>
          {posto.precos.length === 0 ? (
            <p className="muted" style={{ marginTop: 12 }}>
              Sem preços cadastrados ainda.
            </p>
          ) : (
            <div className="price-grid">
              {posto.precos.map((preco) => (
                <div key={preco.id} className="price-card">
                  <div className="price-card-label">{COMBUSTIVEL_LABELS[preco.combustivel]}</div>
                  <div className="price-card-value">{formatBRL(Number(preco.valor))}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {isAuthenticated ? (
          <section className="card panel-highlight">
            <h2>Atualizar preço</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              Chegou aqui e o preço tá diferente? Atualize pra ajudar quem vem depois.
            </p>
            <PrecoForm postoId={posto.id} />
          </section>
        ) : (
          <section className="card">
            <h2>Atualizar preço</h2>
            <p className="muted" style={{ marginTop: 12 }}>
              <Link to="/login">Entre na sua conta</Link> para atualizar o preço deste posto.
            </p>
          </section>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <HistoricoPrecos postoId={posto.id} />
      </div>
    </div>
  );
}
