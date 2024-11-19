import { useStore } from '../store/store';

const LeaderCard = ({ player, index }) => {
    return (
        <div
            key={index}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 0, 0.4)',
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

const UserCard = ({ player, index }) => {
    return (
        <div
            key={index}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'white',
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
            <h1 style={{ fontSize: '24 px', textAlign: 'center' }}>Лобби</h1>
            {lobbyList.map((player, index) =>
                player.isLeader ? (
                    <LeaderCard player={player} index={index} />
                ) : (
                    <UserCard player={player} index={index} />
                )
            )}
        </>
    );
};

export default LobbyList;
