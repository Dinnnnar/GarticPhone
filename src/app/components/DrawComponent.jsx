// import Brush from "../tools/Brush";
import { useRef } from 'react';
import Timer from './Timer';

function DrawComponent() {
    const canvasRef = useRef();

    // useEffect(() => {
    //     new Brush(canvasRef.current, socket);
    // }, []);

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
