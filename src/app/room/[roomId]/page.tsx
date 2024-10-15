'use client'
import { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { socket } from '../../../../lib/socket';
import { joinRoom } from '../../../../tools/joinRoom';
import MemberList from '../../../../components/MemberList';
import UsernameModal from '../../../../components/UsernameModal';
import { useStore } from '../../../../store/store';
import RoomHeader from '../../../../components/RoomHeader';
import ExitButton from '../../../../components/ExitButton';

const RoomPage: React.FC = ({children}) => {
  const { roomId } = useParams();
  const router = useRouter();
  const { 
    updateMembers, 
    username, 
    setUsername, 
    statusPhase, 
    setStatusPhase, 
    isModalOpen, 
    setIsModalOpen, 
    isConnected, 
    setIsConnected,
    isMain,
    setIsMain,
  } = useStore();

  const joinRoomCallback = useCallback(() => {
    joinRoom(isConnected, setIsConnected, setUsername, username, setIsModalOpen, roomId as string);
  }, [isConnected, setIsConnected, setUsername, username, setIsModalOpen, roomId]);

  useEffect(() => {
    const handleRoomUpdated = ({ user, roomId, members }) => {
      console.log("Room updated:", { user, roomId, members });
      updateMembers(members);
    };

    const handleDisconnect = (reason) => {
      console.log("Disconnected:", reason);
      setIsConnected(false);
    };

    const handleReconnect = () => {
      console.log("Reconnected");
      joinRoomCallback();
    };

    const handleMainStatus = () => {
      setIsMain(true);
    };

    const handleNotFound = () => {
      router.push('/');
      console.log('room-not-found');
      
    };


    const handlePhaseStatus = (phaseStatus) => {
      console.log('Phase status', phaseStatus);
      setStatusPhase(phaseStatus);
    };
    if( !isConnected) joinRoomCallback();

    socket.on("room-updated", handleRoomUpdated);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);
    socket.on("phase-status", handlePhaseStatus);
    socket.on("main-status", handleMainStatus);
    socket.on("room-not-found", handleNotFound);

    return () => {
      socket.off("room-updated", handleRoomUpdated);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
      socket.off("phase-status", handlePhaseStatus);
    };
  }, [username, joinRoomCallback, updateMembers, setIsConnected, setStatusPhase]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {children}
    </div>
  );
};

const RoomCompoundComponent: React.FC = () => {
  const { 
    statusPhase, 
    isModalOpen, 
    isMain,
  } = useStore();

  return (
  <RoomPage>  
    {statusPhase === 'start' && <RoomHeader />}
    <MemberList />
    {statusPhase === 'start'  && <ExitButton />}
    {isMain && <p>You a main player</p>}
    {isModalOpen && <UsernameModal />}
  </RoomPage>
  )
}

export default RoomCompoundComponent;