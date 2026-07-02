import { useParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { usePostoQuery } from '../../features/postos/api/postos.queries';
import { PrecoForm } from '../../features/postos/components/PrecoForm';
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
      <div className="container">
        <ErrorBanner message={error instanceof Error ? error.message : 'Erro ao carregar posto.'} />
      </div>
    );
  }

  if (!posto) {
    return null;
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card">
        <h1>{posto.nome}</h1>
        <p className="muted">
          {posto.bandeira} · {posto.endereco}, {posto.bairro} — {posto.cidade}/{posto.estado}
        </p>

        <h2 style={{ marginTop: 24 }}>Preços</h2>
        {posto.precos.length === 0 ? (
          <p className="muted">Sem preços cadastrados ainda.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {posto.precos.map((preco) => (
              <li
                key={preco.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span>{COMBUSTIVEL_LABELS[preco.combustivel]}</span>
                <span className="price-tag">{formatBRL(Number(preco.valor))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isAuthenticated ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Atualizar preço</h2>
          <PrecoForm postoId={posto.id} />
        </div>
      ) : (
        <p className="muted" style={{ marginTop: 16 }}>
          Entre na sua conta para atualizar o preço deste posto.
        </p>
      )}
    </div>
  );
}
