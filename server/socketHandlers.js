import { createRoom, joinRoom, leaveRoom, disconnectUser } from "./roomService.js";

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('create-room', ({ username }) => createRoom(io, socket, username));
    socket.on('join-room', ({ roomId, username }) => joinRoom(io, socket, roomId, username));
    socket.on('leave-room', ({ roomId, username }) => leaveRoom(io, socket, roomId, username));
    socket.on('disconnect', () => disconnectUser(io, socket));
  });
}