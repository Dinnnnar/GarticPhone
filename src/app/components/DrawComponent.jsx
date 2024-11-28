import { useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import Brush from '../lib/Brush';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';

function DrawComponent() {
    const [theme, setTheme] = useState('');
    const [roomId, setRoomId] = useState(null);
    const canvasRef = useRef();
    const isFirstRender = useRef(true);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const room = query.get('room');
        setRoomId(room);

        if (room && isFirstRender.current) {
            socket.emit('data-request', { roomId: room });
            isFirstRender.current = false;
        }
    }, []);

    useEffect(() => {
        const handleData = ({ data }) => {
            console.log('Received data:', data);
            setTheme(data);
        };

        socket.on('data', handleData);

        return () => {
            socket.off('data', handleData);
        };
    }, []);

    useEffect(() => {
        if (roomId) {
            new Brush(canvasRef.current, socket, roomId);
        }
    }, [roomId]);

    return (
        <div className="Draw">
            <Timer />
            <h1>Draw</h1>
            <div>
                <h1>{theme !== '' ? theme : 'Draw what you want'}</h1>
                <canvas
                    style={{ border: '1px solid black' }}
                    ref={canvasRef}
                    width={300}
                    height={350}
                />
            </div>
        </div>
    );
}

export default DrawComponent;
