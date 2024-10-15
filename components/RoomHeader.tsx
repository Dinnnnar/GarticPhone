import React from "react";
import { useParams } from "next/navigation";
import { useStore } from "../store/store";

const RoomHeader: React.FC = () => {
  const { roomId } = useParams();
  const username = useStore(state => state.username);
  
  return (
    <>
      <h1>Welcome to Room: {roomId}</h1>
      <h2>Your username: {username}</h2>
    </>
  );
};

export default RoomHeader;