import './App.css';
import { useEffect, useState } from 'react';
import { socket } from './lib/socket';
import { useStore } from './store/store';
import LobbyList from './components/LobbyList';
import StartButton from './components/StartButton';
import UserLanding from './components/UserLanding';
import ThemeComponent from './components/ThemeComponent';
import DrawComponent from './components/DrawComponent';
import DescribeComponent from './components/DescribeComponent';
import PresentationComponent from './components/PresentationComponent';

const App = () => {
    const query = new URLSearchParams(location.search);

    const roomId = query.get('room');
    const {
        updateLobbyList,
        updateIsLeader,
        phase,
        updatePhase,
        updateBlock,
        block,
        updateRoomId,
        updateData,
        updateTheme,
        theme,
    } = useStore();

    useEffect(() => {
        // let reconnectInterval;

        const handleConnectionError = () => {
            console.log('Failed to join room:');
            updatePhase('noconnected');
            // connectSocket();
        };

        if (socket.connected) {
            socket.disconnect();
        }

        socket.connect();

        // connectSocket();
        updateRoomId(roomId);

        const handleRoomUpdated = ({ members, newPhase }) => {
            console.log('room updated');
            const currentUser = members.find((member) => member.id == socket.id);
            const isLeader = currentUser?.isLeader;
            updateIsLeader(isLeader);
            updateLobbyList(members);
            updatePhase(newPhase);

            // if (newPhase != phase) {
            //     console.log('soemthing');
            //     updatePhase(newPhase);
            // }

            if (currentUser?.block) updateBlock(currentUser?.block);
        };

        const handleRoomJoined = ({ members, newPhase }) => {
            if (newPhase === 'drawPhase' || newPhase === 'describePhase') {
                console.log('request');
                socket.emit('data-request', { roomId: roomId });
            }

            console.log('room joined');
            const currentUser = members.find((member) => member.id == socket.id);
            const isLeader = currentUser?.isLeader;
            updateIsLeader(isLeader);
            updateLobbyList(members);

            if (currentUser?.block) updateBlock(currentUser?.block);
        };

        const handlePhaseUpdated = ({ newPhase }) => {
            if (newPhase === 'drawPhase' || newPhase === 'describePhase') {
                console.log('request');
                socket.emit('data-request', { roomId: roomId });
            }
            console.log('phase-updated');
            updatePhase(newPhase);
        };

        const handleBlock = ({ block }) => {
            updateBlock(block);
        };

        const handleData = ({ data }) => {
            console.log('Received data:', data);
            updateData(data);
        };

        // if (phase === 'lobby') {
        //     socket.on('room-joined', handleRoomJoined);
        //     socket.on('block', handleBlock);
        //     socket.on('room-updated', handleRoomUpdated);
        //     socket.on('phase-updated', handlePhaseUpdated);
        //     socket.on('data', handleData);
        //     socket.on('connection-error', handleConnectionError);
        // } else {
        //     socket.off('room-updated', handleRoomUpdated);
        // }

        socket.on('room-joined', handleRoomJoined);
        socket.on('block', handleBlock);
        socket.on('room-updated', handleRoomUpdated);
        socket.on('phase-updated', handlePhaseUpdated);
        socket.on('data', handleData);
        socket.on('connection-error', handleConnectionError);

        const tg = window.Telegram.WebApp;

        if (tg) {
            tg.ready();
            const user = tg.initDataUnsafe.user;

            console.log(window.Telegram.WebApp.themeParams.bg_color);

            if (window.Telegram.WebApp.themeParams.bg_color !== '#ffffff') {
                updateTheme('dark-theme');
                console.log(theme);
            }

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
            socket.off('room-joined', handleRoomJoined);
            socket.off('room-updated', handleRoomUpdated);
            socket.off('block', handleBlock);
            socket.off('phase-updated', handlePhaseUpdated);
            socket.off('data', handleData);
            socket.off('connection-error', handleConnectionError);
            // clearTimeout(reconnectInterval);
            socket.disconnect();
        };
    }, []);

    return (
        <>
            {phase === 'lobby' && (
                <h1
                    style={{
                        fontFamily: 'Oswald',
                        fontSize: '40px',
                        color: theme === 'dark-theme' ? 'white' : 'black',
                    }}
                >
                    Лобби
                </h1>
            )}
            {phase === 'lobby' && <LobbyList />}
            {phase === 'lobby' && <StartButton />}

            {/* {phase === 'themePhase' && <UserLanding />} */}
            {phase === 'themePhase' && <ThemeComponent />}

            {phase === 'describePhase' && <DescribeComponent />}

            {phase === 'drawPhase' && <DrawComponent />}

            {phase === 'presentation' && <PresentationComponent />}

            {phase === 'noconnected' && (
                <>
                    <h2
                        style={{
                            fontFamily: 'Oswald',
                            fontSize: '40px',
                            color: theme === 'dark-theme' ? 'white' : 'black',
                        }}
                    >
                        Игра уже началась
                    </h2>
                    <div
                        className={theme + '_noConnected'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '9px',
                        }}
                    >
                        <img
                            src="https://media1.tenor.com/m/rLtoDKjOtukAAAAd/al-bundy-married-with-children.gif"
                            alt=""
                            width={350}
                        ></img>
                    </div>
                </>
            )}
        </>
    );
};

export default App;
