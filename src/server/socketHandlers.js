import Latin from './tools/Latin.js';

const rooms = {};

export function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        socket.on('join-room', ({ roomId, username, photoUrl }) => {
            let room = rooms[roomId];

            if (!room) {
                room = rooms[roomId] = {
                    currentPhase: 'lobby',
                    members: [],
                    playerCount: 0,
                    data: [],
                    timer: null,
                };
            }

            const existingUserIndex = rooms[roomId]?.members?.findIndex(
                (member) => member.username === username
            );

            if (room.currentPhase !== 'lobby' && existingUserIndex === -1) {
                console.log('no way', room.currentPhase, existingUserIndex);
                socket.emit('connection-error');
                socket.disconnect();
                return;
            }
            joinRoom(io, socket, roomId, username, photoUrl);
        });
        socket.on('disconnect', (reason) => disconnectUser(io, socket, reason));
        socket.on('start-game', (roomId) => startGame(io, socket, roomId));
        socket.on('data', ({ data, roomId }) => handleData(io, socket, data, roomId));
        socket.on('data-request', ({ roomId }) => handleDataRequest(io, socket, roomId));
        socket.on('user-data-request', ({ roomId, data }) =>
            handleUserDataRequest(io, socket, data, roomId)
        );
        socket.on('timer', (roomId) => handleTimer(io, socket, roomId));
        socket.on('restart', ({ roomId }) => handleRestart(io, socket, roomId));
    });
}

function joinRoom(io, socket, roomId, username, photoUrl) {
    if (socket.rooms.has(roomId)) {
        return;
    }

    if (!rooms[roomId]) {
        rooms[roomId] = { members: [], currentPhase: 'lobby', data: [] };
        console.log('start a new game');
    }

    const existingUserIndex = rooms[roomId]?.members?.findIndex(
        (member) => member.username === username
    );

    if (rooms[roomId].currentPhase !== 'lobby' && existingUserIndex === -1) {
        socket.emit('connection-error', { reason: 'Room is not in lobby phase' });
        socket.emit('phase-updated', { newPhase: 'noconnected' });
        return;
    }

    socket.join(roomId);

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
    }

    rooms[roomId].playerCount += 1;

    console.log('-'.repeat(10));
    console.log('Members in room:');
    rooms[roomId].members.map((item) => {
        console.log(item.username);
    });
    console.log('-'.repeat(10));

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
        newPhase: rooms[roomId].currentPhase,
    });

    io.to(roomId).emit('room-updated', {
        members: rooms[roomId].members.map((member) => ({
            id: member.id,
            username: member.username,
            photoUrl: member.photoUrl,
            isLeader: member.isLeader,
            block: member?.block,
        })),
        newPhase: rooms[roomId].currentPhase,
    });
}

function handleRestart(io, socket, roomId) {
    const roomSockets = io.sockets.adapter.rooms.get(roomId);
    const room = rooms[roomId];
    console.log(roomId);

    // Отключаем всех пользователей в комнате
    // if (roomSockets) {
    //     roomSockets.forEach((socketId) => {
    //         const clientSocket = io.sockets.sockets.get(socketId);
    //         if (clientSocket) {
    //             clientSocket.disconnect();
    //         }
    //     });
    // }

    room.currentPhase = 'lobby';
    room.data = [];
    room.members = rooms[roomId].members.map((member) => ({
        id: member.id,
        username: member.username,
        photoUrl: member.photoUrl,
        isLeader: member.isLeader,
        block: false,
    }));

    io.to(roomId).emit('room-updated', {
        members: room.members,
        newPhase: room.currentPhase,
    });
}

function disconnectUser(io, socket, reason) {
    for (const roomId in rooms) {
        const index = rooms[roomId].members.findIndex((member) => member.id === socket.id);
        if (index !== -1) {
            console.log(
                `User ${rooms[roomId].members[index].username} disconnected. Reason: ${reason}`
            );
            rooms[roomId].playerCount -= 1;
            if (rooms[roomId].currentPhase === 'lobby' || rooms[roomId].members.length === 1) {
                // добавить смену лидера во врекмя финальной фазы
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
                clearTimeout(rooms[roomId].timeoutID);
                console.log('Delete a room');
                delete rooms[roomId];
            } else if (rooms[roomId].currentPhase === 'lobby') {
                io.to(roomId).emit('room-updated', {
                    members: rooms[roomId].members.map((member) => ({
                        id: member.id,
                        username: member.username,
                        photoUrl: member.photoUrl,
                        isLeader: member.isLeader,
                        block: member?.block,
                    })),
                    newPhase: rooms[roomId].currentPhase,
                });
            }
            break;
        }
    }
}

function startGame(io, socket, roomId) {
    const room = rooms[roomId];
    if (!room) return;

    room.roundCount = -1;

    room.finalCount = room.members.length;

    const List = new Latin(room.finalCount);
    room.list = List;
    room.data = Array.from({ length: room.finalCount }, () => Array(room.finalCount).fill(null));

    room.members.map((member) => ({
        id: member.id,
        username: member.username,
        photoUrl: member.photoUrl,
        isLeader: member.isLeader,
        block: false,
    }));

    console.log(room.list);

    console.log('\n');

    setTimer(io, roomId, 15000, 'themePhase');
}

function handleData(io, socket, data, roomId) {
    const room = rooms[roomId];
    if (!room) {
        console.warn(`Room with ID ${roomId} not found.`);
        return;
    }

    if (room.currentPhase === 'presentation') return;

    const memberIndex = room.members?.findIndex((member) => member.id === socket.id);
    if (memberIndex === -1) {
        console.warn(`Member with socket ID ${socket.id} not found in room ${roomId}.`);
        return;
    }

    const member = room.members[memberIndex];

    if (room.currentPhase === 'themePhase' || room.currentPhase === 'describePhase') {
        member.block = true;
        socket.emit('block', { block: true });
    } else {
        member.block = false;
        socket.emit('block', { block: false });
    }

    if (!room.data) {
        room.data = [];
    }

    if (!room.data[room.roundCount]) {
        room.data[room.roundCount] = [];
    }

    const number = room.list[room.roundCount].findIndex((item) => item === member.number);

    if (typeof data === 'string') {
        room.data[room.roundCount][number] = data.slice(0, 50);
    } else {
        room.data[room.roundCount][number] = data;
    }

    // room.data[room.roundCount][number] = data;

    // if (room.currentPhase !== 'drawPhase')
    console.log(room.data[room.roundCount]);

    const receivedDataCount = room.data[room.roundCount].filter(
        (item) => item && typeof item === 'string'
    ).length;

    if (
        (receivedDataCount === room.finalCount && room.currentPhase === 'describePhase') ||
        (receivedDataCount === room.finalCount && room.currentPhase === 'themePhase')
    ) {
        clearInterval(room.intervalID);
        clearTimeout(room.timeoutID);
        delete room.intervalID;
        delete room.timeoutID;
        const nextPhase = typeof data === 'string' ? 'drawPhase' : 'describePhase';
        const time = nextPhase === 'drawPhase' ? 30000 : 15000;
        setTimer(io, roomId, time, nextPhase);
    }
}

async function handleDataRequest(io, socket, roomId) {
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

    // console.log(`Socket request from ${socket.id}`);

    const member = room.members[memberIndex];

    const number = room.list[room.roundCount].findIndex((item) => item === member.number);

    const data = room.data[room.roundCount - 1][number];

    await new Promise((resolve) => setTimeout(resolve, 100));

    socket.emit('data', { data: data });
}

async function handleUserDataRequest(io, socket, data, roomId) {
    const room = rooms[roomId];
    const userIndex = room.members.findIndex((member) => member.username === data);

    const user = room.members[userIndex];

    const number = room.list[0].findIndex((item) => item === user.number);
    io.to(roomId).emit('clear');

    for (let i = 0; i < room.finalCount; i++) {
        const content = room.data[i][number];
        const userIndex = room.list[i][number];
        const member = room.members.find((member) => member.number == userIndex);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (i === 0) {
            io.emit('selectedUser', { username: member.username });
        }
        console.log('content:', content);
        io.to(roomId).emit('userContentArray', { data: content, member: member });
    }
}

async function handleTimer(io, socket, roomId) {
    const room = rooms[roomId];
    if (!room) return;

    while (!room?.timer) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    socket.emit('timer-updated', { timer: room.timer });
}

function setTimer(io, roomId, time, nextPhase) {
    const room = rooms[roomId];
    if (!room) return;

    room.roundCount += 1;
    console.log('-'.repeat(10));

    if (room.roundCount === room.finalCount) {
        room.currentPhase = 'presentation';
        console.log(`Current round: ${room.roundCount} - ${room.currentPhase}`);
        io.to(roomId).emit('phase-updated', { newPhase: 'presentation' });
        return;
    }

    room.currentPhase = nextPhase;

    console.log(`Current round: ${room.roundCount} - ${room.currentPhase}`);

    io.to(roomId).emit('phase-updated', { newPhase: room.currentPhase });

    const endTime = Math.floor((Date.now() + time) / 1000);
    room.timer = time / 1000;

    room.intervalID = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        room.timer = endTime - currentTime;

        if (room.timer <= 0) {
            clearInterval(room.intervalID);
            delete room.intervalID;
        }
    }, 1000);

    room.timeoutID = setTimeout(() => {
        if (room.intervalID) {
            clearInterval(room.intervalID);
            delete room.intervalID;
        }

        nextPhase = room.currentPhase === 'drawPhase' ? 'describePhase' : 'drawPhase';
        time = time === 15000 ? 30000 : 15000;
        console.log('-'.repeat(10));
        setTimer(io, roomId, time, nextPhase);
    }, time);
}
