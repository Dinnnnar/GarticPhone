import { socket } from '../lib/socket';
import { useStore } from '../store/store';

const UserCard = ({ player }) => {
    const query = new URLSearchParams(location.search);
    const roomId = query.get('room');

    const handleUserClick = (username) => {
        // document.getElementById('sumbitIdData').setAttribute('disabled', 'disabled');
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
        >
            <img
                src={player.photoUrl || 'https://via.placeholder.com/50'}
                alt={player.username}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <span>{player.username}</span>
        </button>
    );
};

const PlayersButtonList = () => {
    const { lobbyList } = useStore();
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
            }}
        >
            {lobbyList.map((player) => (
                <UserCard key={player.id} player={player} />
            ))}
        </div>
    );
};

export default PlayersButtonList;
