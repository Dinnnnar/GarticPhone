export function generateRoomId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }