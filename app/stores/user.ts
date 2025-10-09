import { defineStore } from 'pinia'

export type UserRole = 'ADMIN' | 'CLIENT' | 'RESTAURATEUR'

export interface AppUser {
  name: string
  email: string
  password: string
  role: UserRole
}

interface UserState {
  users: AppUser[]
  currentUser: AppUser | null
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    isLoggedIn: false,
  }),
  actions: {
    registerOrLogin(payload: AppUser) {
      const existing = this.users.find(u => u.email.toLowerCase() === payload.email.toLowerCase())
      if (!existing) {
        this.users.push({ ...payload })
      } else {
        existing.name = payload.name
        existing.password = payload.password
        existing.role = payload.role
      }
      this.currentUser = { ...payload }
      this.isLoggedIn = true
    },
    login(payload: { email: string; password: string }) {
      const found = this.users.find(u => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password)
      if (found) {
        this.currentUser = { ...found }
        this.isLoggedIn = true
        return true
      }
      return false
    },
    logout() {
      this.currentUser = null
      this.isLoggedIn = false
    },
  },
  persist: true,
})
