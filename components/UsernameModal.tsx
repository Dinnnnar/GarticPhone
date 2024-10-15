import React, { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';
import { joinRoom } from '../tools/joinRoom';
import { useStore } from '../store/store';

const UsernameModal: React.FC = () => {
  const { setUsername, username, setIsModalOpen, isConnected, setIsConnected } = useStore();
  const [inputValue, setInputValue] = useState<string>(username);
  const { roomId } = useParams();

  useEffect(() => {
    setInputValue(username);
  }, [username]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setUsername(inputValue); 
      localStorage.setItem('roomInfo', JSON.stringify({ user: inputValue }));
      setIsModalOpen(false);
      joinRoom(isConnected, setIsConnected, setUsername, username, setIsModalOpen, roomId as string);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
        <h2>Choose your username</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
        />
        <button onClick={handleSubmit} style={{ margin: "0.5rem", padding: "0.5rem" }}>
          Set Username
        </button>
      </div>
    </div>
  );
};

export default UsernameModal;