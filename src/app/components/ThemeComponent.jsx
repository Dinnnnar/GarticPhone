import { useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';
import Timer from './Timer';

function ThemeComponent() {
    const { block, theme } = useStore();
    const roomId = window.Telegram.WebApp.initDataUnsafe.start_param;

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
                        <h2
                            style={{
                                color: theme === 'dark-theme' ? 'white' : 'black',
                                fontFamily: 'Oswald',
                                fontSize: '40px',
                            }}
                        >
                            Напишите тему
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                maxWidth: '400px',
                                margin: '0 auto',
                            }}
                        >
                            <input
                                id="initialtext"
                                type="text"
                                maxLength="50"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleClick();
                                    }
                                }}
                                placeholder="Тема"
                                style={{
                                    width: '90%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    fontSize: '16px',
                                }}
                            />
                            <button
                                style={{
                                    backgroundColor: theme === 'light-theme' ? '#333' : '#40a7e3',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontFamily: 'Oswald',
                                    fontSize: '20px',
                                    boxShadow:
                                        theme === 'light-theme'
                                            ? '0 2px 4px rgba(0, 0, 0, 0.5)'
                                            : '0 2px 4px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s, transform 0.3s',
                                }}
                                id="submitThemeButton"
                                onClick={handleClick}
                            >
                                Отправить
                            </button>
                        </div>
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
