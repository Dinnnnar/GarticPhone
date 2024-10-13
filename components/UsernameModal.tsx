import React, { useState, useEffect } from 'react';
import { useStore } from '../store/store';

interface UsernameModalProps {
  currentUsername: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  isModalOpen: boolean;
  onSubmit: () => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({
  currentUsername,
  setUsername,
  isModalOpen,
  onSubmit,
}) => {
  
  const updateUsername = useStore(state => state.updateUsername);
  const username = useStore(state => state.username);
  const [inputValue, setInputValue] = useState<string>(username);
  useEffect(() => {
    setInputValue(username); // Обновляем поле при изменении имени пользователя
  }, [username]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      updateUsername(inputValue);
      // setUsername(inputValue); 
      onSubmit();   
    }
  };

  return isModalOpen ? (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
        <h2>Choose your username</h2>
        <input
          type="text"
          onChange={(e) => updateUsername(e.target.value)}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
        />
        <button onClick={handleSubmit} style={{ margin: "0.5rem", padding: "0.5rem" }}>
          Set Username
        </button>
      </div>
    </div>
  ) : null;
};

export default UsernameModal;
