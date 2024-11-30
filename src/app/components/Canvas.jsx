import React, { useEffect, useRef } from 'react';

function Canvas({ data, width = 300, height = 350, duration = 2000 }) {
    const canvasRef = useRef();

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            draw(data, canvasRef.current, duration);
        }
    }, [data, duration]);

    function draw(actions, canvas, duration) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const totalCommands = actions.length;
        const startTime = performance.now();
        const timePerCommand = duration / totalCommands;

        function render(currentTime) {
            const elapsedTime = currentTime - startTime;
            const commandsToRender = Math.min(
                Math.floor(elapsedTime / timePerCommand),
                totalCommands
            );

            for (let i = 0; i < commandsToRender; i++) {
                if (!actions[i].executed) {
                    const [command, ...args] = actions[i];
                    switch (command) {
                        case 'lineTo':
                            ctx.lineTo(...args);
                            break;
                        case 'moveTo':
                            ctx.moveTo(...args);
                            break;
                        case 'beginPath':
                            ctx.beginPath();
                            break;
                        case 'stroke':
                            ctx.stroke();
                            break;
                        default:
                            console.warn('Неизвестная команда рисования:', command);
                            break;
                    }
                    actions[i].executed = true;
                }
            }

            if (commandsToRender < totalCommands) {
                requestAnimationFrame(render);
            }
        }

        requestAnimationFrame(render);
    }

    return (
        <div>
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
    );
}

export default React.memo(Canvas);
