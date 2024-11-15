import { io, Socket } from 'socket.io-client';

const SERVER =
  process.env.NODE_ENV === 'production'
    ? 'https://tdhjd4qq-3000.euw.devtunnels.ms/'
    : 'https://5cba-194-226-199-2.ngrok-free.app';

// Инициализация сокета
export const socket = io(SERVER, { transports: ['websocket'] });