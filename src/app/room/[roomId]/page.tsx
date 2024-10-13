'use client'
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { socket } from '../../../../lib/socket';
import UsernameModal from '../../../../components/UsernameModal';
import MemberList from '../../../../components/MemberList';
import { useStore } from '../../../../store/store';

const RoomPage: React.FC = ({children}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { roomId } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const updateMembers = useStore(state => state.updateMembers)
  const username = useStore(state => state.username);
  const setUsername = useStore(state => state.updateUsername);


  const joinRoom = useCallback(() => {
    console.log('use a join function')
    console.log(isConnected)
    if (isConnected) return;

    const storedInfo = localStorage.getItem('roomInfo');
    if (storedInfo) {
      const { user } = JSON.parse(storedInfo);
      setUsername(user);
      socket.emit("join-room", { roomId, username: user });
      setIsConnected(true);
    } else if(!username){
      setIsModalOpen(true);
    } else {
      socket.emit("join-room", { roomId, username: username });
      setIsConnected(true);
    }
  }, [roomId]);

  const handleUsernameSubmit = () => {
    localStorage.setItem('roomInfo', JSON.stringify({ user: username }));
    setIsModalOpen(false);
    console.log('handleUsenameSubmit')
    joinRoom();
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", { roomId, username });
    localStorage.removeItem('roomInfo');
    router.push('/');
  };

  useEffect(() => {
    const handleRoomUpdated = ({ user, roomId, members }) => {
      console.log("Room updated:", { user, roomId, members });
      
      updateMembers(members);
    };

    const handleDisconnect = (reason) => {
      console.log('handleUsenameDisconnect')
      if (reason === "io server disconnect") {
        socket.connect();
      }
      console.log("Disconnected:", reason);
      setIsConnected(false);
    };

    const handleReconnect = () => {
      console.log("Reconnected");
      joinRoom();
    };

    joinRoom();

    socket.on("room-updated", handleRoomUpdated);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("room-updated", handleRoomUpdated);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
      setIsConnected(true);
    };
  }, [joinRoom]);

  return (
    <>
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Room: {roomId}</h1>
      <h2>Your username: {username}</h2>
    {children}
    <button onClick={handleLeaveRoom} style={{ margin: "1rem", padding: "0.5rem" }}>Leave Room</button>
      {isModalOpen && (
        <UsernameModal
          currentUsername={username}
          setUsername={setUsername}
          isModalOpen={isModalOpen}
          onSubmit={handleUsernameSubmit}
        />
      )}
    </div>
    </>
  );
};

const RoomCompoundComponent: React.FC = () => {
   return (
   <RoomPage>  
    <MemberList />
   </RoomPage>
   );
  }

export default RoomCompoundComponent;