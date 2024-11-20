import { useEffect, useRef } from 'react';
import Timer from './Timer';
import Brush from '../lib/Brush';
import { socket } from '../lib/socket';

function DrawComponent() {
    const canvasRef = useRef();
    const query = new URLSearchParams(location.search);
    const roomId = query.get('room');

    useEffect(() => {
        new Brush(canvasRef.current, socket, roomId);
    }, []);

    return (
        <div className="Draw">
            <Timer />
            <h1>Draw</h1>
            <div>
                {/* <h1>{theme !== 'null' ? theme : 'Draw what you want'}</h1> */}
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
