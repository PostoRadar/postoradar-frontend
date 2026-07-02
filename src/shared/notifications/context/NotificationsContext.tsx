import { useQueryClient } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';
import { io } from 'socket.io-client';
import { env } from '../../config/env';

/**
 * Conecta ao postoradar-notifications assim que o app abre — sem depender de
 * login (UC08: "Colaborador e qualquer cliente conectado"). Ao receber
 * preco:atualizado, invalida a mesma query key que useAtualizarPrecoMutation
 * já invalida (ver postos.queries.ts), então nenhuma tela precisa saber que
 * o dado veio de um WebSocket.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(env.notificationsUrl);
    let jaConectouAntes = false;

    const invalidarPostos = () => {
      queryClient.invalidateQueries({ queryKey: ['postos'] });
    };

    socket.on('connect', () => {
      // Ignora a primeira conexão (o mount já busca os dados via API); só
      // resincroniza numa reconexão após queda, cobrindo o UC08-A1.
      if (jaConectouAntes) invalidarPostos();
      jaConectouAntes = true;
    });
    socket.on('preco:atualizado', invalidarPostos);

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return children;
}
