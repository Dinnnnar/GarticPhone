import { io, Socket } from 'socket.io-client';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const SERVER = process.env.NODE_ENV === 'production' ? 'something' : process.env.WEBHOOK_DOMAIN;

export const socket = io(SERVER, { transports: ['websocket'] });
