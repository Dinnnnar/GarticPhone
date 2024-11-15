import './App.css'
import { useEffect, useState } from "react";
import { socket } from "./lib/socket";
import { useStore } from './store/store';
import LobbyList from './components/LobbyList';
import StartButton from './components/StartButton';

const App = () => {
  const query = new URLSearchParams(location.search);
  
  const roomId = query.get('room');
  const { updateLobbyList, updateIsLeader } = useStore();


  useEffect(() => {
    if (socket.connected) {
      socket.disconnect();
    }
    
    socket.connect();
    
    const handleRoomUpdated = ({ members }) => {
      console.log(members)
      const currentUser = members.find(member => member.id == socket.id);
      const isLeader = currentUser?.isLeader;

      updateIsLeader(isLeader);
      updateLobbyList(members);
    }; 
    socket.on("room-joined", handleRoomUpdated);
    socket.on('room-updated', handleRoomUpdated);

    const tg = window.Telegram.WebApp;
    
    if (tg) {
      tg.ready();
      const user = tg.initDataUnsafe.user;
      
      if (user) {
        const telegramUsername =  `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;
        
        const photoUrl = user.photo_url || 'https://via.placeholder.com/50';


        if (!socket.connected) {
          socket.emit('join-room', { 
            roomId: roomId, 
            username: telegramUsername,
            photoUrl: photoUrl
          });
        }
      }
    }

    return () => {
      socket.off('room-joined', handleRoomUpdated);
      socket.off('room-updated', handleRoomUpdated);
      socket.disconnect();
    };
  }, []);

  return (
    <>
    <LobbyList />
    <StartButton />
    </>
  );
};



export default App;