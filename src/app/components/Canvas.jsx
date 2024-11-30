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
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const totalCommands = actions.length;
        const interval = Math.min(1, Math.floor(30 / totalCommands));

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
            setTimeout(render, interval);
        }

        render();
    }

    return (
        <div>
            <canvas
                style={{
                    border: '2px solid #ddd', // Граница холста
                    borderRadius: '8px', // Закругленные углы
                    backgroundColor: '#fff', // Белый фон
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Тень для объёмности
                    display: 'block', // Устраняет лишние отступы
                    margin: '16px auto', // Центрирование с отступами
                    maxWidth: '100%', // Адаптация для небольших экранов
                    height: 'auto', // Сохранение пропорций
                }}
                width={width}
                height={height}
                ref={canvasRef}
            />
        </div>
    );
}

export default React.memo(Canvas);
