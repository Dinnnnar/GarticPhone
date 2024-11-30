import { useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import Brush from '../lib/Brush';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';

function DrawComponent() {
    const [roomId, setRoomId] = useState(null);
    const canvasRef = useRef();
    const { data, theme } = useStore();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const room = query.get('room');
        setRoomId(room);
    }, []);

    useEffect(() => {
        if (roomId) {
            new Brush(canvasRef.current, socket, roomId);
        }
    }, [roomId]);

    return (
        <div className="Draw">
            <Timer />
            <div>
                <h1 style={{ color: theme === 'dark-theme' ? 'white' : 'black' }}>
                    {data ? data : 'Draw what you want'}
                </h1>
                <canvas
                    style={{
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'block',
                        margin: '16px auto',
                        maxWidth: '100%',
                        height: 'auto',
                    }}
                    width={window.innerWidth * 0.95}
                    height={window.innerWidth * 0.95 * (350 / 300)}
                    ref={canvasRef}
                />
            </div>
        </div>
    );
}

export default DrawComponent;
