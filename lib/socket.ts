// socket.ts
import { io, Socket } from 'socket.io-client';

const SERVER =
  process.env.NODE_ENV === 'production'
    ? 'https://scribble-production-d6c0.up.railway.app'
    : 'http://localhost:3000';

// Инициализация сокета
export const socket: Socket = io(SERVER, { transports: ['websocket'] });
