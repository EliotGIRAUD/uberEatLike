import { defineStore } from 'pinia'
import { useRestaurateurStore } from './restaurateur'

export type UserRole = 'ADMIN' | 'CLIENT' | 'RESTAURATEUR'

export interface AppUser {
  name: string
  email: string
  password: string
  role: UserRole
  restaurateurId?: string 
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
    async initDefaultAdmin() {
      try {
        const response = await fetch('/admin.json')
        if (response.ok) {
          const adminData: AppUser = await response.json()
          const adminIndex = this.users.findIndex(u => u.email.toLowerCase() === adminData.email.toLowerCase())
          if (adminIndex !== -1) {
            // Mettre à jour l'admin existant avec les nouvelles données
            this.users[adminIndex] = { ...adminData }
          } else {
            this.users.push(adminData)
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'admin par défaut:', error)
      }
    },
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

      const restaurateurStore = useRestaurateurStore()
      const restaurateur = restaurateurStore.getRestaurateurByEmail(payload.email)
      
      if (restaurateur && restaurateur.password === payload.password) {
        this.currentUser = {
          name: restaurateur.nom,
          email: restaurateur.email,
          password: restaurateur.password,
          role: 'RESTAURATEUR',
          restaurateurId: restaurateur.id,
        }
        this.isLoggedIn = true
        return true
      }

      return false
    },
    logout() {
      this.currentUser = null
      this.isLoggedIn = false
    },
    updateProfile(payload: Partial<AppUser>) {
      if (!this.currentUser) return false
      
      if (payload.email && payload.email !== this.currentUser.email) {
        const emailExists = this.users.find(u => u.email.toLowerCase() === (payload.email as string).toLowerCase())
        if (emailExists) return false
      }
      
      const oldEmail = this.currentUser.email
      this.currentUser = { ...this.currentUser, ...payload }
      
      const userIndex = this.users.findIndex(u => u.email.toLowerCase() === oldEmail.toLowerCase())
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.currentUser }
      }
      
      return true
    },
  },
  persist: true,
})
