import { useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';
import Timer from './Timer';

function ThemeComponent() {
    const { block } = useStore();
    const query = new URLSearchParams(location.search);
    const roomId = query.get('room');

    const handleClick = () => {
        document.getElementById('submitThemeButton').setAttribute('disabled', 'disabled');
        socket.emit('theme', { theme: `${document.getElementById('initialtext').value}`, roomId });
    };

    return (
        <div className="Theme">
            <Timer />
            {!block && (
                <>
                    <h2>Напишите тему</h2>
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

export default ThemeComponent;
