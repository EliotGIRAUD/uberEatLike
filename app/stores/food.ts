import { defineStore } from 'pinia'

export interface Food {
  id: number
  restaurantId: string
  name: string
  description: string
  grosseDescription?: string
  price: number
  imageUrl?: string
}

interface FoodState {
  foods: Food[]
}

export const useFoodStore = defineStore('food', {
  state: (): FoodState => ({
    foods: [],
  }),
  getters: {
    getFoodsByRestaurant: (state) => (restaurantId: string) => {
      return state.foods.filter(food => food.restaurantId === restaurantId)
    },
    getFoodById: (state) => (id: number) => {
      return state.foods.find(food => food.id === id)
    },
  },
  actions: {
    addFood(food: Omit<Food, 'id'>) {
      const newFood: Food = {
        ...food,
        id: Date.now() + Math.floor(Math.random() * 1000),
      }
      this.foods.push(newFood)
      return { success: true, message: 'Plat ajouté avec succès', food: newFood }
    },
    updateFood(id: number, data: Partial<Omit<Food, 'id'>>) {
      const index = this.foods.findIndex(f => f.id === id)
      if (index === -1) {
        return { success: false, message: 'Plat non trouvé' }
      }

      this.foods[index] = { ...this.foods[index], ...data }
      return { success: true, message: 'Plat mis à jour avec succès' }
    },
    deleteFood(id: number) {
      const index = this.foods.findIndex(f => f.id === id)
      if (index === -1) {
        return { success: false, message: 'Plat non trouvé' }
      }

      this.foods.splice(index, 1)
      return { success: true, message: 'Plat supprimé avec succès' }
    },
  },
  persist: true,
})

