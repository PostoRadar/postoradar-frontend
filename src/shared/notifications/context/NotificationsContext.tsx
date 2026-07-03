import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { io } from 'socket.io-client';
import type { Combustivel } from '../../../features/postos/types/postos.types';
import { env } from '../../config/env';
import { useUserLocation } from '../../geo/context/GeoLocationContext';
import { haversineKm } from '../../geo/proximity';
import { NotificationCenter } from '../components/NotificationCenter';

const RAIO_KM_STORAGE_KEY = 'postoradar.notificacoes.raioKm';
const TOAST_DURACAO_MS = 8000;

export interface PrecoAtualizadoPayload {
  postoId: string;
  nomePosto: string;
  bairro: string;
  cidade: string;
  latitude: number;
  longitude: number;
  combustivel: Combustivel;
  valor: number;
  reportadoPor: string;
  atualizadoEm: string;
}

export interface NotificationToast extends PrecoAtualizadoPayload {
  id: string;
  distanceKm: number | null;
}

interface NotificationsContextValue {
  raioKm: number | null;
  setRaioKm: (km: number | null) => void;
  toasts: NotificationToast[];
  dispensarToast: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

function lerRaioSalvo(): number | null {
  const bruto = localStorage.getItem(RAIO_KM_STORAGE_KEY);
  const numero = bruto ? Number(bruto) : NaN;
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

/**
 * Conecta ao postoradar-notifications assim que o app abre — sem depender de
 * login (UC08: "Colaborador e qualquer cliente conectado"). Ao receber
 * preco:atualizado, invalida a mesma query key que useAtualizarPrecoMutation
 * já invalida (ver postos.queries.ts), então nenhuma tela precisa saber que
 * o dado veio de um WebSocket. Além disso mostra um toast visual — filtrado
 * por distância se o usuário configurar um raio (ex.: só postos a 5 km).
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { location: userLocation, requestLocation, status: locationStatus } = useUserLocation();
  const [raioKm, setRaioKmState] = useState<number | null>(lerRaioSalvo);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // O listener do socket é registrado uma única vez (no mount); estas refs
  // deixam ele sempre enxergar o raio/localização mais recentes sem precisar
  // reconectar o socket a cada mudança de preferência.
  const raioKmRef = useRef(raioKm);
  const userLocationRef = useRef(userLocation);
  useEffect(() => {
    raioKmRef.current = raioKm;
  }, [raioKm]);
  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  const setRaioKm = useCallback(
    (km: number | null) => {
      setRaioKmState(km);
      if (km === null) {
        localStorage.removeItem(RAIO_KM_STORAGE_KEY);
      } else {
        localStorage.setItem(RAIO_KM_STORAGE_KEY, String(km));
        // Filtrar por distância exige saber onde o usuário está — só pede a
        // localização agora, na ação explícita de configurar o raio (mesma
        // regra do filtro "Mais próximos" em PostoFilterBar).
        if (locationStatus === 'idle') requestLocation();
      }
    },
    [locationStatus, requestLocation],
  );

  const dispensarToast = useCallback((id: string) => {
    setToasts((atual) => atual.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const socket = io(env.notificationsUrl);
    let jaConectouAntes = false;

    const invalidarPostos = () => {
      queryClient.invalidateQueries({ queryKey: ['postos'] });
      // O histórico também muda a cada atualização de preço; mantém a tela de
      // detalhe em dia quando um evento chega em tempo real.
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    };

    socket.on('connect', () => {
      // Ignora a primeira conexão (o mount já busca os dados via API); só
      // resincroniza numa reconexão após queda, cobrindo o UC08-A1.
      if (jaConectouAntes) invalidarPostos();
      jaConectouAntes = true;
    });

    socket.on('preco:atualizado', (dados: PrecoAtualizadoPayload) => {
      invalidarPostos();

      const raio = raioKmRef.current;
      const localizacao = userLocationRef.current;
      const distanceKm = localizacao ? haversineKm(localizacao, dados) : null;

      // Sem raio configurado, mostra tudo. Com raio configurado, só mostra
      // se a distância for conhecida e estiver dentro do limite.
      if (raio !== null && (distanceKm === null || distanceKm > raio)) return;

      const id = `${dados.postoId}-${dados.atualizadoEm}`;
      setToasts((atual) => [...atual, { ...dados, id, distanceKm }]);
      setTimeout(() => dispensarToast(id), TOAST_DURACAO_MS);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, dispensarToast]);

  const value = useMemo<NotificationsContextValue>(
    () => ({ raioKm, setRaioKm, toasts, dispensarToast }),
    [raioKm, setRaioKm, toasts, dispensarToast],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <NotificationCenter />
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications deve ser usado dentro de <NotificationsProvider>');
  }
  return ctx;
}
