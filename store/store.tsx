import { create } from 'zustand'

export const useStore = create((set) => ({
    members: [],
    updateMembers: (newMembers) => set(state => (
        {
         members: newMembers 
        }
    )),
    username: '',
    updateUsername: (newUsername) => set(state => (
        {
         username: newUsername 
        }
    )),
}))
