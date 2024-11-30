import { useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';

const UserCard = ({ player }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const query = new URLSearchParams(location.search);
    const roomId = query.get('room');
    const { theme } = useStore();
    console.log(theme);

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
                    marginRight: '12px',
                }}
            />
            <span
                style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: theme === 'light-theme' ? 'black' : 'white',
                }}
            >
                {player.username}
            </span>
        </button>
    );
};

const PlayersButtonList = () => {
    const { lobbyList } = useStore();
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
        </div>
    );
};

export default PlayersButtonList;
