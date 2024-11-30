import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';
import Canvas from './Canvas';
import PlayersButtonList from './PlayersButtonList';

const UserCard = ({ player, children }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '12px',
                wordWrap: 'break-word',
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
                    }}
                />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{player.username}</span>
            </div>
            <div
                style={{
                    backgroundColor: '#ffffff',
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
        </div>
    );
};

function PresentationComponent() {
    const [data, setData] = useState([]);
    const { isLeader } = useStore();

    useEffect(() => {
        const handleData = ({ data, member }) => {
            console.log(data);
            console.log(data == null);
            setData((prevData) => [
                ...prevData,
                typeof data === 'string' ? (
                    <>
                        <UserCard key={member.id} player={member}>
                            <h2>{data}</h2>
                        </UserCard>
                    </>
                ) : data == null ? (
                    <>
                        <UserCard key={member.id} player={member}>
                            <h2>No comments</h2>
                        </UserCard>
                    </>
                ) : (
                    <>
                        <UserCard key={member.id} player={member}>
                            <Canvas data={data} />
                        </UserCard>
                    </>
                ),
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
            <h1>Presentation</h1>
            {isLeader && <PlayersButtonList />}
            {data && data}
        </div>
    );
}

export default PresentationComponent;
