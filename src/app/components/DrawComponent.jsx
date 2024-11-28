import { useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import Brush from '../lib/Brush';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';

function DrawComponent() {
    const [theme, setTheme] = useState('');

    useEffect(() => {
        const canvasRef = useRef();

        const query = new URLSearchParams(location.search);
        const roomId = query.get('room');

        socket.emit('data-request', roomId);

        const handleData = ({ data }) => {
            console.log('data', data);
            setTheme(theme);
        };

        socket.on('data', handleData);

        return () => {
            socket.off('data', handleData);
        };
    }, []);

    useEffect(() => {
        new Brush(canvasRef.current, socket, roomId);
    }, []);

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
