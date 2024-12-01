import { io, Socket } from 'socket.io-client';

const SERVER = import.meta.env.VITE_WEBHOOK_DOMAIN;
console.log('server', SERVER);

export const socket = io(SERVER, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
});
