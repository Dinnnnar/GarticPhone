import { useEffect, useRef, useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';
import Timer from './Timer';
import Canvas from './Canvas';

function DescribeComponent() {
    const { block, theme } = useStore();
    const [roomId, setRoomId] = useState(null);
    const [data, setData] = useState(null);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const room = query.get('room');
        setRoomId(room);

        if (room && isFirstRender.current) {
            console.log('data-request');
            socket.emit('data-request', { roomId: room });
            isFirstRender.current = false;
        }
    }, []);

    useEffect(() => {
        const handleData = ({ data }) => {
            console.log('Received data:', data);
            setData(data);
        };

        socket.on('data', handleData);

        return () => {
            socket.off('data', handleData);
        };
    }, []);

    const handleClick = () => {
        document.getElementById('submitThemeButton').setAttribute('disabled', 'disabled');
        socket.emit('data', { data: `${document.getElementById('initialtext').value}`, roomId });
    };

    return (
        <div className="Describe">
            <Timer />
            {data !== null && !block && <Canvas data={data} />}
            {!block && (
                <>
                    <h2 style={{ color: theme === 'dark-theme' ? 'white' : 'black' }}>
                        Опишите рисунок
                    </h2>
                    <input id="initialtext" type="text" maxLength="50"></input>
                    <br />
                    <button id="submitThemeButton" onClick={handleClick}>
                        Отправить
                    </button>
                </>
            )}
            {block && (
                <>
                    <img
                        src="https://media1.tenor.com/m/xKJ0blGgIlQAAAAd/dance-happy.gif"
                        alt=""
                    ></img>
                </>
            )}
        </div>
    );
}

export default DescribeComponent;
