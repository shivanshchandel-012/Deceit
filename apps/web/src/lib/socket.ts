import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@deceit/game-types';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocketUrl(): string {
  return process.env.NEXT_PUBLIC_WS_URL?.trim().replace(/\/$/, '') || '';
}

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    const wsUrl = getSocketUrl();
    if (!wsUrl) {
      throw new Error(
        'NEXT_PUBLIC_WS_URL is not configured. Please set it in Vercel environment variables.'
      );
    }

    socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });
  }
  return socket;
}
