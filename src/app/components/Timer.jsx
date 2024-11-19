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
            console.log('timer update', timer);
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

    return <div>{timer > 0 && <h2>Оставшееся время: {timer} секунд</h2>}</div>;
}

export default Timer;
