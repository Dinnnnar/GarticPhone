import { useStore } from "../store/store";


const StartButton = () => {
    console.log('Start button clicked');
    const { isLeader } = useStore();
    return (
        isLeader && <button style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '8px'
          }}>Начать игру</button>
    );
  };
  
  export default StartButton;
  