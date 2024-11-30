import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';

function Timer() {
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const roomId = query.get('room');

        socket.emit('timer', roomId);

        const handleTimerUpdate = ({ timer }) => {
            setTime(timer);
            setTimer(timer);
        };

        socket.on('timer-updated', handleTimerUpdate);

        return () => {
            socket.off('timer-updated', handleTimerUpdate);
        };
    }, []);

    useEffect(() => {
        if (time > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [time]);

    const progress = timer > 0 ? (timer / time) * 100 : 0;

    return (
        <div style={{ textAlign: 'center' }}>
            <svg
                width="60"
                height="60"
                viewBox="0 0 36 36"
                style={{ margin: '20px auto', display: 'block' }}
            >
                <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="2" />
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#007bff"
                    strokeWidth="2"
                    strokeDasharray="100 100"
                    strokeDashoffset={`calc(100 - ${progress})`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                    className="progress-circle"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
        </div>
    );
}

export default Timer;
