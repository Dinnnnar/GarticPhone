import React, { useEffect, useRef } from 'react';

function Canvas({ data }) {
    const canvasRef = useRef();

    useEffect(() => {
        if (data !== 'null') {
            draw(data, canvasRef.current);
        }
    }, [data]);

    function draw(actions, canvas) {
        const ctx = canvas.getContext('2d');
        const actionsArray = JSON.parse(actions);

        for (let i = 0; i < actionsArray.length; ++i) {
            setTimeout(() => {
                if (actionsArray[i][0] === 'lineTo') {
                    ctx.lineTo(actionsArray[i][1], actionsArray[i][2]);
                } else if (actionsArray[i][0] === 'moveTo') {
                    ctx.moveTo(actionsArray[i][1], actionsArray[i][2]);
                } else if (actionsArray[i][0] === 'beginPath') {
                    ctx.beginPath();
                } else if (actionsArray[i][0] === 'stroke') {
                    ctx.stroke();
                }
            }, i * 3);
        }
    }

    return (
        <div>
            <canvas style={{ border: '1px solid black' }} ref={canvasRef} />
        </div>
    );
}

export default Canvas;
