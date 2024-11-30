import React, { useEffect, useRef } from 'react';

function Canvas({ data, width = 300, height = 350 }) {
    const canvasRef = useRef();

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            draw(data, canvasRef.current);
        }
    }, [data]);

    function draw(actions, canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста

        const totalCommands = actions.length;
        const interval = Math.max(1, Math.floor(300 / totalCommands)); // Регулируем задержку

        let index = 0;

        function render() {
            if (index >= totalCommands) return;

            const [command, ...args] = actions[index];
            if (command === 'lineTo') {
                ctx.lineTo(...args);
            } else if (command === 'moveTo') {
                ctx.moveTo(...args);
            } else if (command === 'beginPath') {
                ctx.beginPath();
            } else if (command === 'stroke') {
                ctx.stroke();
            } else {
                console.warn('Unknown drawing command:', command);
            }

            index++;
            setTimeout(render, interval); // Задержка
        }

        render();
    }

    return (
        <div>
            <canvas
                style={{ border: '1px solid black' }}
                width={width}
                height={height}
                ref={canvasRef}
            />
        </div>
    );
}

export default React.memo(Canvas);
