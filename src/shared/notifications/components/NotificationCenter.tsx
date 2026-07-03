import { useState } from 'react';
import { formatBRL } from '../../utils/currency';
import { COMBUSTIVEL_LABELS } from '../../utils/enums';
import { useNotifications } from '../context/NotificationsContext';

/**
 * Widget flutuante global: mostra os toasts de preço atualizado e permite
 * configurar o raio de distância que o usuário quer ser notificado.
 */
export function NotificationCenter() {
  const { raioKm, setRaioKm, toasts, dispensarToast } = useNotifications();
  const [painelAberto, setPainelAberto] = useState(false);
  const [rascunhoKm, setRascunhoKm] = useState(raioKm !== null ? String(raioKm) : '');

  function salvarRaio() {
    const numero = Number(rascunhoKm);
    const valido = rascunhoKm.trim() !== '' && Number.isFinite(numero) && numero > 0;
    setRaioKm(valido ? numero : null);
    setPainelAberto(false);
  }

  return (
    <div className="notification-widget">
      <div className="notification-toast-stack">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            type="button"
            className="notification-toast"
            onClick={() => dispensarToast(toast.id)}
            title="Clique para dispensar"
          >
            <strong>🔔 Preço atualizado</strong>
            <span>
              {toast.nomePosto} · {COMBUSTIVEL_LABELS[toast.combustivel]}
            </span>
            <span className="price-tag">{formatBRL(toast.valor)}</span>
            {toast.distanceKm !== null && (
              <span className="muted">📍 {toast.distanceKm.toFixed(1)} km de você</span>
            )}
          </button>
        ))}
      </div>

      {painelAberto && (
        <div className="notification-settings-panel">
          <label htmlFor="raio-notificacao">Notificar sobre postos a até quantos km?</label>
          <input
            id="raio-notificacao"
            type="number"
            min={1}
            placeholder="Todos"
            value={rascunhoKm}
            onChange={(e) => setRascunhoKm(e.target.value)}
          />
          <div className="notification-settings-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setPainelAberto(false)}>
              Cancelar
            </button>
            <button type="button" className="btn" onClick={salvarRaio}>
              Salvar
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="notification-bell"
        onClick={() => setPainelAberto((aberto) => !aberto)}
        aria-label="Configurar notificações"
      >
        🔔
        {raioKm !== null && <span className="notification-bell-badge">{raioKm}km</span>}
      </button>
    </div>
  );
}
