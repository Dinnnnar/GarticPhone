'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "../../lib/socket";
import { useStore } from "../../store/store";

interface CreateRoomForm {
  username: string;
}

interface RoomJoinedData {
  user: string;
  roomId: string;
  members: string[];
}

const CreateRoomPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { 
    updateMembers,
    setUsername,
    username
  } = useStore();

  useEffect(() => {
    const handleRoomJoined = ({ user, roomId, members }: RoomJoinedData) => {
      updateMembers(members);
      setUsername(user);
      console.log("Room joined:", { user, roomId, members });
      localStorage.setItem('roomInfo', JSON.stringify({ roomId, user }));
      router.push(`/room/${roomId}`);
    };

    const handleError = ({ message }: { message: string }) => {
      alert(`Error: ${message}`);
      setIsLoading(false);
    };

    socket.on("room-joined", handleRoomJoined);
    socket.on("room-not-found", handleError);
    socket.on("invalid-data", handleError);

    return () => {
      socket.off('room-joined', handleRoomJoined);
      socket.off('room-not-found', handleError);
      socket.off('invalid-data', handleError);
    };
  }, [router]);

  const onSubmit = ({ username }: CreateRoomForm) => {
    setIsLoading(true);
    socket.emit("create-room", { username });
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Create a Room</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "0.5rem", width: "300px", marginBottom: "1rem" }}
        />
        <br />
        <button
          onClick={() => onSubmit({ username })}
          style={{ padding: "0.5rem 1rem" }}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Room"}
        </button>
      </div>
    </div>
  );
};

export default CreateRoomPage;