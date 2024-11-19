import './App.css';
import { useEffect, useState } from 'react';
import { socket } from './lib/socket';
import { useStore } from './store/store';
import LobbyList from './components/LobbyList';
import StartButton from './components/StartButton';
import UserLanding from './components/UserLanding';
import ThemeComponent from './components/ThemeComponent';
import DrawComponent from './components/DrawComponent';

const App = () => {
    const query = new URLSearchParams(location.search);

    const roomId = query.get('room');
    const { updateLobbyList, updateIsLeader, phase, updatePhase, updateBlock, block } = useStore();

    useEffect(() => {
        if (socket.connected) {
            socket.disconnect();
        }

        socket.connect();

        const handleRoomUpdated = ({ members, phase }) => {
            const currentUser = members.find((member) => member.id == socket.id);
            const isLeader = currentUser?.isLeader;
            updateIsLeader(isLeader);
            updateLobbyList(members);
            updatePhase(phase);
            if (currentUser?.block) updateBlock(currentUser?.block);
        };

        const handlePhaseUpdated = ({ phase }) => {
            updatePhase(phase);
        };

        const handleBlock = ({ block }) => {
            updateBlock(block);
        };

        socket.on('room-joined', handleRoomUpdated);
        socket.on('block', handleBlock);
        socket.on('room-updated', handleRoomUpdated);
        socket.on('phase-updated', handlePhaseUpdated);

        const tg = window.Telegram.WebApp;

        if (tg) {
            tg.ready();
            const user = tg.initDataUnsafe.user;

            if (user) {
                const telegramUsername = `${user.first_name}${
                    user.last_name ? ' ' + user.last_name : ''
                }`;

                const photoUrl = user.photo_url || 'https://via.placeholder.com/50';

                if (!socket.connected) {
                    socket.emit('join-room', {
                        roomId: roomId,
                        username: telegramUsername,
                        photoUrl: photoUrl,
                    });
                }
            }
        }

        return () => {
            socket.off('room-joined', handleRoomUpdated);
            socket.off('room-updated', handleRoomUpdated);
            socket.disconnect();
        };
    }, []);

    return (
        <>
            {phase === 'lobby' && <LobbyList />}
            {phase === 'lobby' && <StartButton />}

            {phase === 'themePhase' && <UserLanding />}
            {phase === 'themePhase' && <ThemeComponent />}

            {phase === 'drawPhase' && <DrawComponent />}

            {phase === 'presentation' && <h1>Final</h1>}
        </>
    );
};

export default App;
