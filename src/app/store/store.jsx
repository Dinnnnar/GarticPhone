import { create } from 'zustand';

export const useStore = create((set) => ({
    userPhoto: null,
    updateUserPhoto: (newUserPhoto) => set({ userPhoto: newUserPhoto }),
    lobbyList: [],
    updateLobbyList: (newUsers) => set({ lobbyList: newUsers }),
    isLeader: false,
    updateIsLeader: (newValue) => set({ isLeader: newValue }),
    phase: 'lobby',
    updatePhase: (newPhase) => set({ phase: newPhase }),
    block: false,
    updateBlock: (newValue) => set({ block: newValue }),
    timer: 0,
    updateTimer: (newTime) => set({ timer: newTime }),
    roomId: '',
    updateRoomId: (newRoomId) => set({ roomId: newRoomId }),
    data: null,
    updateData: (newData) => set({ data: newData }),
    theme: 'light-theme',
    updateTheme: (newTheme) => set({ theme: newTheme }),
}));
