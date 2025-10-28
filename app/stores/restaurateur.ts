import { defineStore } from 'pinia'

export interface Restaurateur {
  id: string
  nom: string
  adresse: string
  codePostal: string
  ville: string
  email: string
  password: string
}

interface RestaurateurState {
  restaurateurs: Restaurateur[]
}

export const useRestaurateurStore = defineStore('restaurateur', {
  state: (): RestaurateurState => ({
    restaurateurs: [],
  }),
  getters: {
    getRestaurateurById: (state) => (id: string) => {
      return state.restaurateurs.find(r => r.id === id)
    },
    getRestaurateurByEmail: (state) => (email: string) => {
      return state.restaurateurs.find(r => r.email.toLowerCase() === email.toLowerCase())
    },
  },
  actions: {
    addRestaurateur(restaurateur: Omit<Restaurateur, 'id'>) {
      const emailExists = this.restaurateurs.find(
        r => r.email.toLowerCase() === restaurateur.email.toLowerCase()
      )
      if (emailExists) {
        return { success: false, message: 'Cet email est déjà utilisé' }
      }

      const newRestaurateur: Restaurateur = {
        ...restaurateur,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }

      this.restaurateurs.push(newRestaurateur)
      return { success: true, message: 'Restaurateur ajouté avec succès' }
    },
    updateRestaurateur(id: string, data: Partial<Omit<Restaurateur, 'id'>>) {
      const index = this.restaurateurs.findIndex(r => r.id === id)
      if (index === -1) {
        return { success: false, message: 'Restaurateur non trouvé' }
      }

      if (data.email) {
        const emailExists = this.restaurateurs.find(
          r => r.id !== id && r.email.toLowerCase() === data.email.toLowerCase()
        )
        if (emailExists) {
          return { success: false, message: 'Cet email est déjà utilisé' }
        }
      }

      this.restaurateurs[index] = { ...this.restaurateurs[index], ...data }
      return { success: true, message: 'Restaurateur mis à jour avec succès' }
    },
    deleteRestaurateur(id: string) {
      const index = this.restaurateurs.findIndex(r => r.id === id)
      if (index === -1) {
        return { success: false, message: 'Restaurateur non trouvé' }
      }

      this.restaurateurs.splice(index, 1)
      return { success: true, message: 'Restaurateur supprimé avec succès' }
    },
  },
  persist: true,
})

