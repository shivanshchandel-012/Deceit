import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@deceit/game-types';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocketUrl(): string {
  return process.env.NEXT_PUBLIC_WS_URL?.trim().replace(/\/$/, '') || '';
}

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    const wsUrl = getSocketUrl();
    socket = io(wsUrl || undefined, {
      autoConnect: Boolean(wsUrl),
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 8000,
    });
  }
  return socket;
}
