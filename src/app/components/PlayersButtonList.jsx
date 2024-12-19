import { useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';

const UserCard = ({ player }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const roomId = window.Telegram.WebApp.initDataUnsafe.start_param;
    const { theme } = useStore();

    const handleUserClick = (username) => {
        socket.emit('user-data-request', {
            data: username,
            roomId,
        });

        setIsDisabled(true);

        setTimeout(() => {
            setIsDisabled(false);
        }, 5000);
    };

    return (
        <button
            id="sumbitIdData"
            onClick={() => handleUserClick(player.username)}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: isDisabled
                    ? '#f0f0f0'
                    : theme === 'light-theme'
                    ? '#ffffff'
                    : '#40a7e3',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s, transform 0.2s',
                width: 'fit-content',
                margin: '10px 3px',
                pointerEvents: isDisabled ? 'none' : 'auto',
            }}
            disabled={isDisabled}
            // onMouseEnter={(e) => {
            //     if (!isDisabled) e.target.style.backgroundColor = '#f9f9f9';
            // }}
            // onMouseLeave={(e) => {
            //     if (!isDisabled) e.target.style.backgroundColor = '#ffffff';
            // }}
            // onMouseDown={(e) => {
            //     if (!isDisabled) e.target.style.transform = 'scale(0.95)';
            // }}
            // onMouseUp={(e) => {
            //     if (!isDisabled) e.target.style.transform = 'scale(1)';
            // }}
        >
            <img
                src={player.photoUrl || 'https://via.placeholder.com/50'}
                alt={player.username}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                }}
            />
        </button>
    );
};

const PlayersButtonList = () => {
    const { lobbyList, theme } = useStore();

    const roomId = window.Telegram.WebApp.initDataUnsafe.start_param;

    function handleRestart() {
        socket.emit('restart', { roomId: roomId });
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                gap: '8px',
            }}
        >
            {lobbyList.map((player) => (
                <UserCard key={player.id} player={player} />
            ))}
            {/* <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px 16px',
                    backgroundColor: theme === 'light-theme' ? '#fff' : '#0d96e6',
                    border: '1px solid rgb(221, 221, 221)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(1, 0, 0, 0.1)',
                    margin: '10px 3px',
                    wordWrap: 'break-word',
                    color: theme === 'light-theme' ? 'black' : 'white',
                }}
            >
                <button
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={handleRestart}
                    aria-label="Перезапуск"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="24px"
                        height="24px"
                    >
                        <path d="M12 2a10 10 0 1 0 7.071 2.929l-1.414 1.415A8 8 0 1 1 12 4v3.586l3.536-3.536L12 1V2ZM12 13h2v2h-4v-4h2v2Z" />
                    </svg>
                </button>
            </div> */}
        </div>
    );
};

export default PlayersButtonList;
