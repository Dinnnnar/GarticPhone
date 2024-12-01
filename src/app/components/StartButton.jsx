import { socket } from '../lib/socket';
import { useStore } from '../store/store';

const StartButton = () => {
    const { isLeader, theme } = useStore(); // Получаем тему из хранилища
    const query = new URLSearchParams(location.search);
    const roomId = query.get('room');

    return (
        isLeader && (
            <button
                style={{
                    backgroundColor: theme === 'light-theme' ? '#333' : '#40a7e3',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Oswald',
                    fontSize: '20px',
                    boxShadow:
                        theme === 'light-theme'
                            ? '0 2px 4px rgba(0, 0, 0, 0.5)'
                            : '0 2px 4px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s, transform 0.3s',
                }}
                onClick={() => {
                    socket.emit('start-game', roomId);
                }}
            >
                Начать игру
            </button>
        )
    );
};

export default StartButton;
