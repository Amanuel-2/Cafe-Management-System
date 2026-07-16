import { io } from 'socket.io-client';

// Use relative path through Vite proxy (dev) or same host (prod)
const SOCKET_URL = '';
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  path: '/socket.io',
});
