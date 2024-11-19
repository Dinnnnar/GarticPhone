import { socket } from '../lib/socket';
import { useStore } from '../store/store';

const StartButton = () => {
    const { isLeader } = useStore();
    const query = new URLSearchParams(location.search);
    const roomId = query.get('room');
    return (
        isLeader && (
            <button
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
