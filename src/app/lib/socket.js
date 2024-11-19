import { io, Socket } from 'socket.io-client';

const SERVER =
    process.env.NODE_ENV === 'production'
        ? 'https://tdhjd4qq-3000.euw.devtunnels.ms/'
        : 'https://hw7m8gq2-3000.euw.devtunnels.ms/';

export const socket = io(SERVER, { transports: ['websocket'] });
