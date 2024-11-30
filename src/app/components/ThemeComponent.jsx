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
        console.log('data theme');
        socket.emit('data', { data: `${document.getElementById('initialtext').value}`, roomId });
    };

    return (
        <>
            <Timer />
            <div
                className="Theme"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // minHeight: '100vh',
                    flexDirection: 'column',
                    // textAlign: 'center',
                }}
            >
                {!block && (
                    <>
                        <h2>Напишите тему</h2>
                        <input id="initialtext" type="text" maxLength="50" />
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
                            alt="Dancing Happy"
                            style={{
                                display: 'block',
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                margin: '16px auto',
                                border: '2px solid #ddd',
                            }}
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default ThemeComponent;
