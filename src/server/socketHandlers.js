const rooms = {};

export function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join-room', ({ roomId, username, photoUrl }) =>
            joinRoom(io, socket, roomId, username, photoUrl)
        );
        socket.on('disconnect', (reason) => disconnectUser(io, socket, reason));
        socket.on('start-game', (roomId) => startGame(io, socket, roomId));
        socket.on('theme', ({ data, roomId }) => handleData(io, socket, data, roomId));
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
        rooms[roomId] = { members: [], currentPhase: 'lobby', data: [] };
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
            number: rooms[roomId].members.length + 1,
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
                clearInterval(rooms[roomId].intervalID);
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
    const room = rooms[roomId];
    if (!room) return;

    room.currentPhase = 'themePhase';
    room.roundCount = 0;

    room.finalCount = room.members.length;

    setTimer(io, roomId, 15000, 'themePhase');
}

function handleData(io, socket, data, roomId) {
    const room = rooms[roomId];
    if (!room) {
        console.warn(`Room with ID ${roomId} not found.`);
        return;
    }

    const memberIndex = room.members?.findIndex((member) => member.id === socket.id);
    if (memberIndex === -1) {
        console.warn(`Member with socket ID ${socket.id} not found in room ${roomId}.`);
        return;
    }

    const member = room.members[memberIndex];
    member.block = true;
    socket.emit('block', { block: true });

    if (!room.data) {
        room.data = [];
    }

    if (!room.data[room.roundCount]) {
        room.data[room.roundCount] = [];
    }

    room.data[room.roundCount][member.number] = data;
    console.log(room.data);
    console.log(`User ${member.username} wrote theme: ${data}`);

    if (room.data[room.roundCount].length === room.finalCount + 1) {
        clearInterval(room.intervalID);
        clearTimeout(room.timeoutID);
        delete room.intervalID;
        delete room.timeoutID;
        const nextPhase = typeof data === 'string' ? 'drawPhase' : 'themePhase';
        const time = nextPhase === 'drawPhase' ? 30000 : 15000;
        setTimer(io, roomId, time, nextPhase);
    }
}

async function handleTimer(io, socket, roomId) {
    const room = rooms[roomId];
    if (!room) return;

    while (!room?.timer) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.emit('timer-updated', { timer: room.timer });
}

function setTimer(io, roomId, time, nextPhase) {
    const room = rooms[roomId];
    if (!room) return;

    room.roundCount += 1;
    console.log('@@@ Current round: ', room.roundCount);

    io.emit('phase-updated', { phase: nextPhase });

    const endTime = Math.floor((Date.now() + time) / 1000);
    room.timer = time / 1000;

    if (room.roundCount === room.finalCount + 1) {
        console.log('finally');
        io.emit('phase-updated', { phase: 'presentation' });
        return;
    }

    room.intervalID = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        room.timer = endTime - currentTime;

        console.log(room.timer);

        if (room.timer <= 0) {
            clearInterval(room.intervalID);
            delete room.intervalID;
        }
    }, 1000);

    room.timeoutID = setTimeout(() => {
        room.currentPhase = nextPhase;
        if (room.intervalID) {
            clearInterval(room.intervalID);
            delete room.intervalID;
        }

        nextPhase = nextPhase === 'drawPhase' ? 'themePhase' : 'drawPhase';
        time = time === 15000 ? 30000 : 15000;
        setTimer(io, roomId, time, nextPhase);
    }, time);
}
