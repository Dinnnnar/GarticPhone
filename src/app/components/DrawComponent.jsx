// import Brush from "../tools/Brush";
import { useRef } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';

function DrawComponent() {
    const { isLeader, phase, theme } = useStore();
    const canvasRef = useRef();

    if (isLeader) {
        socket.emit('request-theme');
    }

    useEffect(() => {
        new Brush(canvasRef.current, socket);
    }, []);

    return (
        <div>
            <h1>{theme !== 'null' ? theme : 'Draw what you want'}</h1>
            <canvas
                style={{ border: '1px solid black' }}
                ref={canvasRef}
                width={800}
                height={600}
            />
        </div>
    );
}

export default DrawComponent;
