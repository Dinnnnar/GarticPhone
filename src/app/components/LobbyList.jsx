import { useStore } from '../store/store';

const LeaderCard = ({ player }) => {
    const { theme } = useStore();
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: theme !== 'dark-theme' ? 'rgba(255, 255, 0, 0.4)' : '#40a7e3',
                color: theme !== 'dark-theme' ? 'black' : 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '8px',
            }}
        >
            <img
                src={player.photoUrl || 'https://via.placeholder.com/50'}
                alt={player.username}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <span>{player.username}</span>
        </div>
    );
};

const UserCard = ({ player }) => {
    const { theme } = useStore();
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: theme !== 'dark-theme' ? 'white' : 'black',
                color: theme !== 'dark-theme' ? 'black' : 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '8px',
            }}
        >
            <img
                src={player.photoUrl || 'https://via.placeholder.com/50'}
                alt={player.username}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <span>{player.username}</span>
        </div>
    );
};

const LobbyList = () => {
    const { lobbyList } = useStore();
    return (
        <>
            {lobbyList.map((player) =>
                player.isLeader ? (
                    <LeaderCard key={player.id} player={player} />
                ) : (
                    <UserCard key={player.id} player={player} />
                )
            )}
        </>
    );
};

export default LobbyList;
