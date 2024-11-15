const rooms = {}; // Объект для хранения комнат и участников

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', ({ roomId, username, photoUrl }) => joinRoom(io, socket, roomId, username, photoUrl));
    socket.on('disconnect', (reason) => disconnectUser(io, socket, reason));
  });
}

function joinRoom(io, socket, roomId, username, photoUrl) {  
    if (socket.rooms.has(roomId)) {
        return;
    }

    console.log(`A user ${socket.id} joined the room with id '${roomId}' and username '${username}'`);

    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = { members: [] };
    }

    const existingUserIndex = rooms[roomId].members.findIndex(member => member.username === username);

    if (existingUserIndex !== -1) {
      rooms[roomId].members[existingUserIndex].id = socket.id;
      rooms[roomId].members[existingUserIndex].photoUrl = photoUrl; 
    } else {
      rooms[roomId].members.push({ id: socket.id, username, photoUrl, isLeader: rooms[roomId].members.length === 0 }); 
    }

    console.log("Members in room:", rooms[roomId].members);

    const currentUser = rooms[roomId].members.find(member => member.id === socket.id);

    socket.emit('room-joined', { 
      user: username, 
      roomId,
      members: rooms[roomId].members.map(member => ({
        id: member.id,
        username: member.username,
        photoUrl: member.photoUrl,
        isLeader: member.isLeader
      }))
    });

    io.to(roomId).emit('room-updated', { 
      members: rooms[roomId].members.map(member => ({
        id: member.id,
        username: member.username,
        photoUrl: member.photoUrl,
        isLeader: member.isLeader
      }))
    });
}

function disconnectUser(io, socket, reason) {
    console.log(`User ${socket.id} disconnected. Reason: ${reason}`);

    for (const roomId in rooms) {
        const index = rooms[roomId].members.findIndex(member => member.id === socket.id);
        if (index !== -1) {
          const [removedMember] = rooms[roomId].members.splice(index, 1);
          if (rooms[roomId].members.length > 0 && !rooms[roomId].members.some(member => member.isLeader)) {
            rooms[roomId].members[0].isLeader = true;
          }
          
          if (rooms[roomId].members.length === 0) {
            delete rooms[roomId];
          } else {
            io.to(roomId).emit('room-updated', { 
              members: rooms[roomId].members.map(member => ({
                username: member.username,
                photoUrl: member.photoUrl,
                isLeader: member.isLeader
              }))
            });
          }
          break;
        }
      }
}
