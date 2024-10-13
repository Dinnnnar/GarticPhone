import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

function generateRoomId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create-room', ({ username }) => {
    if (!username) {
      socket.emit('invalid-data', { message: 'Username is required.' });
      return;
    }

    const roomId = generateRoomId();
    rooms[roomId] = { members: [{ id: socket.id, username }] };
    socket.join(roomId);

    console.log(`${username} created room: ${roomId}`);
    
    socket.emit('room-joined', { user: username, roomId, members: [username] });
  });

  socket.on('join-room', ({ roomId, username }) => {
    if (!rooms[roomId]) {
      socket.emit('room-not-found', { message: 'Room not found.' });
      return;
    }

    if (!username) {
      socket.emit('invalid-data', { message: 'Username is required.' });
      return;
    }

    let isNewUser = true;
    // Проверка, существует ли уже пользователь с таким именем в комнате
    const existingUserIndex = rooms[roomId].members.findIndex(member => member.username === username);
    if (existingUserIndex !== -1) {
      // Если пользователь уже существует, обновляем его socket.id
      rooms[roomId].members[existingUserIndex].id = socket.id;
      isNewUser = false;
    } else {
      // Если это новый пользователь, добавляем его в комнату
      rooms[roomId].members.push({ id: socket.id, username });
    }
    
    socket.join(roomId);

    console.log(`${username} ${isNewUser ? 'joined' : 'rejoined'} room: ${roomId}`);

    // Отправляем обновленный список участников всем в комнате
    io.to(roomId).emit('room-updated', { 
      user: username, 
      roomId, 
      members: rooms[roomId].members.map(member => member.username)
    });
  });

  socket.on('leave-room', ({ roomId, username }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].members = rooms[roomId].members.filter(member => member.id !== socket.id);
    
    socket.leave(roomId);

    if (rooms[roomId].members.length === 0) {
      delete rooms[roomId];
    } else {
      io.to(roomId).emit('room-updated', { 
        user: username, 
        roomId, 
        members: rooms[roomId].members.map(member => member.username)
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    for (const roomId in rooms) {
      const index = rooms[roomId].members.findIndex(member => member.id === socket.id);
      if (index !== -1) {
        const [removedMember] = rooms[roomId].members.splice(index, 1);
        
        if (rooms[roomId].members.length === 0) {
          delete rooms[roomId];
        } else {
          io.to(roomId).emit('room-updated', { 
            user: removedMember.username,
            roomId, 
            members: rooms[roomId].members.map(member => member.username)
          });
        }
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});