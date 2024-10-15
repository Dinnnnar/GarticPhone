import { socket } from "../lib/socket";
import { useParams } from "next/navigation";

export const joinRoom = (isConnected, setIsConnected, setUsername, username, setIsModalOpen, roomId) => {
    console.log('use a join function')
    console.log(isConnected)
    if (isConnected) return;

    const storedInfo = localStorage.getItem('roomInfo');
    if (storedInfo) {
      const { user } = JSON.parse(storedInfo);
      setUsername(user);
      console.log('use a join function ssss')
      socket.emit("join-room", { roomId, username: user });
      setIsConnected(true);
      setIsModalOpen(false);
    } else if(!username){
      setIsModalOpen(true);
    } else {
      socket.emit("join-room", { roomId, username: username });
      setIsConnected(true);
    }
  }