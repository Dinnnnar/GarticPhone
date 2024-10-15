import React from "react";
import { socket } from "../lib/socket";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useStore } from "../store/store";


const ExitButton: React.FC = () => {
    const router = useRouter();
    const { roomId } = useParams();
    const { username } = useStore();
  const handleLeaveRoom = () => {
    socket.emit("leave-room", { roomId, username });
    localStorage.removeItem('roomInfo');
    router.push('/');
  }
  return (
    <>
      <button onClick={handleLeaveRoom} style={{ margin: "1rem", padding: "0.5rem" }}>Leave Room</button>
    </>
  );
};

export default ExitButton;
