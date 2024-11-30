import { useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import Brush from '../lib/Brush';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';

function DrawComponent() {
    const [roomId, setRoomId] = useState(null);
    const canvasRef = useRef();
    const { data } = useStore();

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
            <h1>Draw</h1>
            <div>
                <h1>{data ? data : 'Draw what you want'}</h1>
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
