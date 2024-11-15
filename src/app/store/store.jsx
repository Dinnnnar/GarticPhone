import { create } from "zustand";


export const useStore = create((set) => ({
  userPhoto: null,
  updateUserPhoto: (newUserPhoto) => set({ userPhoto: newUserPhoto }),
  lobbyList: [],
  updateLobbyList: (newUsers) => set({ lobbyList: newUsers }),
  isLeader: false,
  updateIsLeader: (newValue) => set({ isLeader: newValue }),
}))