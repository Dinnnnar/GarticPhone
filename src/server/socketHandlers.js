const rooms = {};

export function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join-room', ({ roomId, username, photoUrl }) =>
            joinRoom(io, socket, roomId, username, photoUrl)
        );
        socket.on('disconnect', (reason) => disconnectUser(io, socket, reason));
        socket.on('start-game', (roomId) => startGame(io, socket, roomId));
        socket.on('theme', ({ theme, roomId }) => handleTheme(io, socket, theme, roomId));
        socket.on('timer', (roomId) => handleTimer(io, socket, roomId));
    });
}

function joinRoom(io, socket, roomId, username, photoUrl) {
    if (socket.rooms.has(roomId)) {
        return;
    }

    console.log(
        `A user ${socket.id} joined the room with id '${roomId}' and username '${username}'`
    );

    socket.join(roomId);

    if (!rooms[roomId]) {
        rooms[roomId] = { members: [], currentPhase: 'lobby' };
    }

    const existingUserIndex = rooms[roomId].members.findIndex(
        (member) => member.username === username
    );

    if (rooms[roomId].members.length === 0) {
        rooms[roomId].playerCount = 0;
    }

    if (existingUserIndex !== -1) {
        rooms[roomId].members[existingUserIndex].id = socket.id;
        rooms[roomId].members[existingUserIndex].photoUrl = photoUrl;
    } else {
        rooms[roomId].members.push({
            id: socket.id,
            username,
            photoUrl,
            isLeader: rooms[roomId].members.length === 0,
        });
        rooms[roomId].playerCount += 1;
    }

    console.log('Members in room:', rooms[roomId].members);

    socket.emit('room-joined', {
        user: username,
        roomId,
        members: rooms[roomId].members.map((member) => ({
            id: member.id,
            username: member.username,
            photoUrl: member.photoUrl,
            isLeader: member.isLeader,
            block: member?.block,
        })),
        phase: rooms[roomId].currentPhase,
    });

    io.to(roomId).emit('room-updated', {
        members: rooms[roomId].members.map((member) => ({
            id: member.id,
            username: member.username,
            photoUrl: member.photoUrl,
            isLeader: member.isLeader,
            block: member?.block,
        })),
        phase: rooms[roomId].currentPhase,
    });
}

function disconnectUser(io, socket, reason) {
    for (const roomId in rooms) {
        const index = rooms[roomId].members.findIndex((member) => member.id === socket.id);
        if (index !== -1) {
            console.log(
                `User ${rooms[roomId].members[index].username} disconnected. Reason: ${reason}`
            );
            console.log(rooms[roomId].playerCount);
            rooms[roomId].playerCount -= 1;
            if (rooms[roomId].currentPhase === 'lobby' || rooms[roomId].members.length === 1) {
                const [removedMember] = rooms[roomId].members.splice(index, 1);
                if (
                    rooms[roomId].members.length > 0 &&
                    !rooms[roomId].members.some((member) => member.isLeader)
                ) {
                    rooms[roomId].members[0].isLeader = true;
                }
            }
            if (rooms[roomId].playerCount === 0) {
                delete rooms[roomId];
            } else {
                io.to(roomId).emit('room-updated', {
                    members: rooms[roomId].members.map((member) => ({
                        id: member.id,
                        username: member.username,
                        photoUrl: member.photoUrl,
                        isLeader: member.isLeader,
                        block: member?.block,
                    })),
                    phase: rooms[roomId].currentPhase,
                });
            }
            break;
        }
    }
}

function startGame(io, socket, roomId) {
    const index = rooms[roomId].members.findIndex((member) => member.id === socket.id);
    rooms[roomId].currentPhase = 'themePhase';
    setTimer(io, roomId, 15000, 'drawPhase');
    io.to(roomId).emit('phase-updated', { phase: 'themePhase' });
}

function handleTheme(io, socket, theme, roomId) {
    const index = rooms[roomId].members.findIndex((member) => member.id === socket.id);
    rooms[roomId].members[index].block = true;
    socket.emit('block', { block: true });
    console.log(`User ${rooms[roomId].members[index].username} write theme: ${theme}`);
}

function handleTimer(io, socket, roomId) {
    console.log('User has started the game', 15);
    socket.emit('timer-updated', { timer: rooms[roomId].timer });
}

function setTimer(io, roomId, time, phase) {
    const installedTime = Math.floor((+new Date() + time) / 1000);
    const timerID = setInterval(() => {
        const currentTime = Math.floor(+new Date() / 1000);
        rooms[roomId].timer = installedTime - currentTime;
        console.log(rooms[roomId].timer);
    }, 1000);
    const timeOutID = setTimeout(() => {
        io.emit('phase-updated', { phase: phase });
        rooms[roomId].currentPhase = phase;
        clearInterval(timerID);
    }, time);
}
