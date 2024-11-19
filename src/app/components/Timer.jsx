import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';

function Timer() {
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState(0);
    const query = new URLSearchParams(location.search);
    const roomId = query.get('room');

    socket.emit('timer', roomId);

    const handleTimerUpdate = ({ timer }) => {
        console.log('timer update', timer);
        setTime(timer);
    };

    socket.on('timer-updated', handleTimerUpdate);

    if (time != 0) {
        const interval = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);
        const clearInterval = setTimeout(() => {
            () => {
                clearTimeout(interval);
            };
        }, time);
    }

    return (
        <div>
            <h2>Оставшееся время: {timer} секунд</h2>
        </div>
    );
}

export default Timer;
