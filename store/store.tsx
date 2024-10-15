import { create } from 'zustand'

type State = {
  members: string[];
  username: string;
  statusPhase: string;
  isModalOpen: boolean;
  isConnected: boolean;
  isMain: boolean;
}

type Actions = {
  updateMembers: (newMembers: string[]) => void;
  setUsername: (newUsername: string) => void;
  setStatusPhase: (newStatusPhase: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsMain: (isMain: boolean) => void;
}

export const useStore = create<State & Actions>((set) => ({
  members: [],
  updateMembers: (newMembers) => set({ members: newMembers }),
  username: '',
  setUsername: (newUsername) => set({ username: newUsername }),
  statusPhase: 'start',
  setStatusPhase: (newStatusPhase) => set({ statusPhase: newStatusPhase }),
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  isConnected: false,
  setIsConnected: (isConnected) => set({ isConnected: isConnected }),
  isMain: false,
  setIsMain: (isMain) => set({ isMain: isMain }),
}))