import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';
import Canvas from './Canvas';
import PlayersButtonList from './PlayersButtonList';

const Card = ({ player, isSelected = false, children }) => {
    const { theme } = useStore();
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                backgroundColor: isSelected
                    ? '#e0f7fa'
                    : theme === 'light-theme'
                    ? '#f9f9f9'
                    : '#0d96e6',
                borderRadius: '8px',
                boxShadow: isSelected
                    ? '0 4px 8px rgba(0, 0, 0, 0.2)'
                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '12px',
                border: isSelected ? '2px solid #00796b' : 'none',
                wordWrap: 'break-word',
                color: theme === 'light-theme' ? 'black' : 'white',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <img
                    src={player.photoUrl || 'https://via.placeholder.com/50'}
                    alt={player.username}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '8px',
                        border: isSelected ? '2px solid #00796b' : 'none',
                    }}
                />
                <span
                    style={{
                        fontWeight: 'bold',
                        color: isSelected ? '#00796b' : theme === 'light-theme' ? 'black' : 'white',
                    }}
                >
                    {player.username}
                </span>
            </div>
            {children && (
                <div
                    style={{
                        backgroundColor: theme === 'light-theme' ? '#ffffff' : '#40a7e3',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: '#555',
                        fontSize: '14px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        alignSelf: 'stretch',
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

const PlayersList = () => {
    const { lobbyList } = useStore();
    const [username, setUsername] = useState('');
    const { theme } = useStore();

    useEffect(() => {
        const handleUsername = ({ username }) => {
            setUsername(username);
        };

        socket.on('selectedUser', handleUsername);

        return () => {
            socket.off('selectedUser', handleUsername);
        };
    }, []);

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
                <Card key={player.id} player={player} isSelected={username === player.username} />
            ))}
        </div>
    );
};

function PresentationComponent() {
    const [data, setData] = useState([]);
    const { isLeader } = useStore();
    const { theme } = useStore();

    useEffect(() => {
        const handleData = ({ data, member }) => {
            setData((prevData) => [
                ...prevData,
                <Card key={member.id} player={member}>
                    {typeof data === 'string' ? (
                        <h2 style={{ color: theme === 'light-theme' ? 'black' : 'white' }}>
                            {data}
                        </h2>
                    ) : data == null ? (
                        <h2>No comments</h2>
                    ) : (
                        <Canvas data={data} />
                    )}
                </Card>,
            ]);
        };

        const handleClear = () => {
            setData('');
        };

        socket.on('userContentArray', handleData);
        socket.on('clear', handleClear);

        return () => {
            socket.off('userContentArray', handleData);
            socket.off('clear', handleClear);
        };
    }, []);

    return (
        <div className="Presentation">
            {isLeader && <PlayersButtonList />}
            {!isLeader && <PlayersList />}
            {data && data}
        </div>
    );
}

export default PresentationComponent;
