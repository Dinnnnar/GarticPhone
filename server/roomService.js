import { generateRoomId } from "./utils.js";

const rooms = {};

export function createRoom(io, socket, username) {
  if (!username) {
    socket.emit('invalid-data', { message: 'Username is required.' });
    return;
  }

  const roomId = generateRoomId();
  rooms[roomId] = { members: [{ id: socket.id, username }], phase: 'start' };
  socket.join(roomId);

  console.log(`${username} created room: ${roomId}`);
  rooms[roomId].mp = username;
  socket.emit('room-joined', { user: username, roomId, members: [username] });
}

export function joinRoom(io, socket, roomId, username) {
    console.log('JOIN ROOM')
  if (!rooms[roomId]) {
    socket.emit('room-not-found', { message: 'Room not found.' });
    return;
  }

  if (!username) {
    socket.emit('invalid-data', { message: 'Username is required.' });
    return;
  }

  let isNewUser = true;
  const existingUserIndex = rooms[roomId].members.findIndex(member => member.username === username);
  
  if (existingUserIndex !== -1) {
    rooms[roomId].members[existingUserIndex].id = socket.id;
    isNewUser = false;
  } else {
    rooms[roomId].members.push({ id: socket.id, username });
  }
  
  socket.join(roomId);

  console.log(`${username} ${isNewUser ? 'joined' : 'rejoined'} room: ${roomId}`);

  if (isNewUser) {
    socket.emit('phase-status', rooms[roomId].phase);
    io.to(roomId).emit('room-updated', { 
        user: username, 
        roomId, 
        members: rooms[roomId].members.map(member => member.username)
      });
  }

  if( username === rooms[roomId].mp) socket.emit('main-status') 
}

export function leaveRoom(io, socket, roomId, username) {
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
}

export function disconnectUser(io, socket) {
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
}