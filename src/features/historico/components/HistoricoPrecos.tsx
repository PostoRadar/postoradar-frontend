import { useMemo, useState } from 'react';
import { useHistoricoQuery } from '../api/historico.queries';
import { formatBRL } from '../../../shared/utils/currency';
import { COMBUSTIVEL_LABELS } from '../../../shared/utils/enums';
import type { Combustivel } from '../../postos/types/postos.types';
import { ErrorBanner } from '../../../shared/components/ErrorBanner';
import { Spinner } from '../../../shared/components/Spinner';
import type { RegistroHistorico } from '../types/historico.types';

function rotuloCombustivel(tipo: string): string {
  return COMBUSTIVEL_LABELS[tipo as Combustivel] ?? tipo;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Variação percentual entre o preço antigo e o novo (null quando não há antigo).
function variacao(registro: RegistroHistorico): number | null {
  if (registro.precoAntigo === null || registro.precoAntigo === 0) return null;
  return ((registro.precoNovo - registro.precoAntigo) / registro.precoAntigo) * 100;
}

export function HistoricoPrecos({ postoId }: { postoId: string }) {
  const { data: registros, isLoading, isError, error } = useHistoricoQuery(postoId);
  const [combustivelFiltro, setCombustivelFiltro] = useState<string>('');

  // Combustíveis que de fato aparecem no histórico deste posto — o dropdown só
  // oferece o que existe, evitando filtros que dariam lista vazia.
  const combustiveisDisponiveis = useMemo(() => {
    const tipos = new Set((registros ?? []).map((r) => r.tipoCombustivel));
    return [...tipos].sort();
  }, [registros]);

  const registrosFiltrados = useMemo(() => {
    if (!registros) return [];
    if (!combustivelFiltro) return registros;
    return registros.filter((r) => r.tipoCombustivel === combustivelFiltro);
  }, [registros, combustivelFiltro]);

  const temResultados = registros && registros.length > 0;

  return (
    <section className="card">
      <div className="historico-header">
        <div>
          <h2>Histórico de preços</h2>
          <p className="muted" style={{ marginTop: 4 }}>
            Cada atualização feita pela comunidade fica registrada aqui.
          </p>
        </div>
        {temResultados && combustiveisDisponiveis.length > 1 && (
          <label className="historico-filtro">
            <span className="muted">⛽ Combustível</span>
            <select
              value={combustivelFiltro}
              onChange={(e) => setCombustivelFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              {combustiveisDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {rotuloCombustivel(tipo)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {isLoading && <Spinner label="Carregando histórico..." />}

      {isError && (
        <ErrorBanner
          message={error instanceof Error ? error.message : 'Erro ao carregar o histórico.'}
        />
      )}

      {!isLoading && !isError && !temResultados && (
        <div className="results-empty">Ainda não há atualizações registradas para este posto.</div>
      )}

      {!isLoading && !isError && temResultados && (
        <ol className="historico-timeline">
          {registrosFiltrados.map((registro) => {
            const pct = variacao(registro);
            const subiu = registro.precoAntigo !== null && registro.precoNovo > registro.precoAntigo;
            const caiu = registro.precoAntigo !== null && registro.precoNovo < registro.precoAntigo;
            const tendencia = subiu ? 'up' : caiu ? 'down' : 'flat';

            return (
              <li key={registro.id} className="historico-item">
                <span className={`historico-dot historico-dot--${tendencia}`} aria-hidden />
                <div className="historico-body">
                  <div className="historico-top">
                    <span className="badge">{rotuloCombustivel(registro.tipoCombustivel)}</span>
                    <time className="muted historico-data">{formatarData(registro.registradoEm)}</time>
                  </div>
                  <div className="historico-precos">
                    {registro.precoAntigo !== null && (
                      <>
                        <span className="historico-antigo">{formatBRL(registro.precoAntigo)}</span>
                        <span className="historico-seta" aria-hidden>→</span>
                      </>
                    )}
                    <span className="historico-novo">{formatBRL(registro.precoNovo)}</span>
                    {pct !== null && (
                      <span className={`historico-var historico-var--${tendencia}`}>
                        {pct > 0 ? '▲' : pct < 0 ? '▼' : ''} {Math.abs(pct).toFixed(1)}%
                      </span>
                    )}
                    {registro.precoAntigo === null && (
                      <span className="muted historico-primeiro">primeiro preço registrado</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
