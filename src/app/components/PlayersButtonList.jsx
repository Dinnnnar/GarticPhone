import { socket } from '../lib/socket';
import { useStore } from '../store/store';

const UserCard = ({ player }) => {
    const query = new URLSearchParams(location.search);
    const roomId = query.get('room');

    const handleUserClick = (username) => {
        socket.emit('user-data-request', {
            data: username,
            roomId,
        });
    };

    return (
        <button
            id="sumbitIdData"
            onClick={() => {
                handleUserClick(player.username);
            }}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'background-color 0.2s, transform 0.2s',
                width: 'fit-content',
                margin: '10px 3px',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f9f9f9')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#ffffff')}
            onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
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
                    color: '#333',
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
