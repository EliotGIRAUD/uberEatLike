import { defineStore } from 'pinia'
import { useRestaurateurStore } from './restaurateur'

export type UserRole = 'ADMIN' | 'CLIENT' | 'RESTAURATEUR'

export interface AppUser {
  name: string
  email: string
  password: string
  role: UserRole
  restaurateurId?: string // ID du restaurateur si c'est un compte restaurateur
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
      // D'abord chercher dans les utilisateurs normaux
      const found = this.users.find(u => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password)
      if (found) {
        this.currentUser = { ...found }
        this.isLoggedIn = true
        return true
      }

      // Si non trouvé, chercher dans les restaurateurs
      const restaurateurStore = useRestaurateurStore()
      const restaurateur = restaurateurStore.getRestaurateurByEmail(payload.email)
      
      if (restaurateur && restaurateur.password === payload.password) {
        // Créer un utilisateur temporaire pour le restaurateur
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
      
      // Vérifier si l'email est déjà utilisé par un autre utilisateur
      if (payload.email && payload.email !== this.currentUser.email) {
        const emailExists = this.users.find(u => u.email.toLowerCase() === (payload.email as string).toLowerCase())
        if (emailExists) return false
      }
      
      // Mettre à jour l'utilisateur actuel
      const oldEmail = this.currentUser.email
      this.currentUser = { ...this.currentUser, ...payload }
      
      // Mettre à jour dans la liste des utilisateurs
      const userIndex = this.users.findIndex(u => u.email.toLowerCase() === oldEmail.toLowerCase())
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.currentUser }
      }
      
      return true
    },
  },
  persist: true,
})
