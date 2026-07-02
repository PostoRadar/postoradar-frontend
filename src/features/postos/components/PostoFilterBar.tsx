import type { ChangeEvent } from 'react';
import { useUserLocation } from '../../../shared/geo/context/GeoLocationContext';
import { COMBUSTIVEL_LABELS, COMBUSTIVEL_OPTIONS } from '../../../shared/utils/enums';
import type { Combustivel } from '../types/postos.types';

// 'proximidade' é resolvido inteiramente no client (ver useProximitySortedPostos)
// e nunca é enviado como `ordenarPor` para GET /postos.
export type OrdenarPorUI = 'recentes' | 'preco' | 'proximidade';

export interface PostoFiltrosUI {
  cidade: string;
  bandeira: string;
  combustivel: Combustivel | '';
  ordenarPor: OrdenarPorUI;
}

interface PostoFilterBarProps {
  filtros: PostoFiltrosUI;
  onChange: (filtros: PostoFiltrosUI) => void;
}

export function PostoFilterBar({ filtros, onChange }: PostoFilterBarProps) {
  const { requestLocation, status } = useUserLocation();

  const handleChange =
    (field: keyof PostoFiltrosUI) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;

      if (field === 'ordenarPor' && value === 'proximidade' && status === 'idle') {
        requestLocation();
      }

      onChange({ ...filtros, [field]: value } as PostoFiltrosUI);
    };

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 16,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="cidade">Cidade</label>
        <input id="cidade" value={filtros.cidade} onChange={handleChange('cidade')} placeholder="Ex: Recife" />
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="bandeira">Bandeira</label>
        <input id="bandeira" value={filtros.bandeira} onChange={handleChange('bandeira')} placeholder="Ex: Shell" />
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="combustivel">Combustível</label>
        <select id="combustivel" value={filtros.combustivel} onChange={handleChange('combustivel')}>
          <option value="">Todos</option>
          {COMBUSTIVEL_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {COMBUSTIVEL_LABELS[c]}
            </option>
          ))}
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="ordenarPor">Ordenar por</label>
        <select id="ordenarPor" value={filtros.ordenarPor} onChange={handleChange('ordenarPor')}>
          <option value="recentes">Mais recentes</option>
          {/* Regra do backend (listarPostosQuerySchema): 'preco' exige combustível. */}
          <option value="preco" disabled={!filtros.combustivel}>
            Menor preço{!filtros.combustivel ? ' (selecione um combustível)' : ''}
          </option>
          <option value="proximidade">Mais próximos</option>
        </select>
      </div>
      {filtros.ordenarPor === 'proximidade' && status === 'denied' && (
        <span className="field-error">Localização negada — mostrando por recentes.</span>
      )}
      {filtros.ordenarPor === 'proximidade' && status === 'loading' && (
        <span className="muted">Obtendo localização...</span>
      )}
    </div>
  );
}
