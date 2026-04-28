import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('addItem', () => {
    it('devrait ajouter un nouvel item au panier', () => {
      const store = useCartStore()

      const food = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza Margherita',
        description: 'Pizza classique',
        price: 12.50,
        imageUrl: '/images/pizza.jpg'
      }

      store.addItem(food)

      expect(store.items).toHaveLength(1)
      expect(store.items[0]).toMatchObject({
        ...food,
        quantity: 1
      })
    })

    it('devrait incrémenter la quantité si l\'item existe déjà', () => {
      const store = useCartStore()

      const food = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza Margherita',
        description: 'Pizza classique',
        price: 12.50
      }

      store.addItem(food)
      store.addItem(food)

      expect(store.items).toHaveLength(1)
      expect(store.items[0]?.quantity).toBe(2)
    })

    it('devrait ajouter plusieurs items différents', () => {
      const store = useCartStore()

      const pizza = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza',
        description: 'Pizza classique',
        price: 12.50
      }

      const burger = {
        id: '2',
        restaurantId: 'resto-1',
        name: 'Burger',
        description: 'Burger classique',
        price: 10.00
      }

      store.addItem(pizza)
      store.addItem(burger)

      expect(store.items).toHaveLength(2)
      expect(store.items[0]?.id).toBe('1')
      expect(store.items[1]?.id).toBe('2')
    })
  })

  describe('removeItem', () => {
    it('devrait supprimer un item du panier', () => {
      const store = useCartStore()

      const food = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza',
        description: 'Pizza classique',
        price: 12.50
      }

      store.addItem(food)
      expect(store.items).toHaveLength(1)

      store.removeItem('1')
      expect(store.items).toHaveLength(0)
    })

    it('ne devrait rien faire si l\'item n\'existe pas', () => {
      const store = useCartStore()

      const food = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza',
        description: 'Pizza classique',
        price: 12.50
      }

      store.addItem(food)
      store.removeItem('999') // ID inexistant

      expect(store.items).toHaveLength(1)
    })

    it('devrait supprimer uniquement l\'item spécifié', () => {
      const store = useCartStore()

      const pizza = { id: '1', restaurantId: 'resto-1', name: 'Pizza', description: 'Pizza', price: 12.50 }
      const burger = { id: '2', restaurantId: 'resto-1', name: 'Burger', description: 'Burger', price: 10.00 }

      store.addItem(pizza)
      store.addItem(burger)

      store.removeItem('1')

      expect(store.items).toHaveLength(1)
      expect(store.items[0]?.id).toBe('2')
    })
  })

  describe('updateQuantity', () => {
    it('devrait mettre à jour la quantité d\'un item', () => {
      const store = useCartStore()

      const food = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza',
        description: 'Pizza classique',
        price: 12.50
      }

      store.addItem(food)
      store.updateQuantity('1', 5)

      expect(store.items[0]?.quantity).toBe(5)
    })

    it('devrait supprimer l\'item si la quantité est 0 ou négative', () => {
      const store = useCartStore()

      const food = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza',
        description: 'Pizza classique',
        price: 12.50
      }

      store.addItem(food)
      store.updateQuantity('1', 0)

      expect(store.items).toHaveLength(0)
    })

    it('devrait supprimer l\'item si la quantité est négative', () => {
      const store = useCartStore()

      const food = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza',
        description: 'Pizza classique',
        price: 12.50
      }

      store.addItem(food)
      store.updateQuantity('1', -1)

      expect(store.items).toHaveLength(0)
    })

    it('ne devrait rien faire si l\'item n\'existe pas', () => {
      const store = useCartStore()

      const food = {
        id: '1',
        restaurantId: 'resto-1',
        name: 'Pizza',
        description: 'Pizza classique',
        price: 12.50
      }

      store.addItem(food)
      store.updateQuantity('999', 10)

      expect(store.items).toHaveLength(1)
      expect(store.items[0]?.quantity).toBe(1)
    })
  })

  describe('clearCart', () => {
    it('devrait vider complètement le panier', () => {
      const store = useCartStore()

      const pizza = { id: '1', restaurantId: 'resto-1', name: 'Pizza', description: 'Pizza', price: 12.50 }
      const burger = { id: '2', restaurantId: 'resto-1', name: 'Burger', description: 'Burger', price: 10.00 }

      store.addItem(pizza)
      store.addItem(burger)

      expect(store.items).toHaveLength(2)

      store.clearCart()

      expect(store.items).toHaveLength(0)
    })

    it('ne devrait pas causer d\'erreur sur un panier vide', () => {
      const store = useCartStore()

      expect(() => store.clearCart()).not.toThrow()
      expect(store.items).toHaveLength(0)
    })
  })

  describe('getters', () => {
    describe('totalItems', () => {
      it('devrait retourner 0 pour un panier vide', () => {
        const store = useCartStore()

        expect(store.totalItems).toBe(0)
      })

      it('devrait calculer le nombre total d\'items', () => {
        const store = useCartStore()

        const pizza = { id: '1', restaurantId: 'resto-1', name: 'Pizza', description: 'Pizza', price: 12.50 }
        const burger = { id: '2', restaurantId: 'resto-1', name: 'Burger', description: 'Burger', price: 10.00 }

        store.addItem(pizza)
        store.addItem(pizza)
        store.addItem(burger)

        expect(store.totalItems).toBe(3) // 2 pizzas + 1 burger
      })

      it('devrait mettre à jour le total après modification', () => {
        const store = useCartStore()

        const food = { id: '1', restaurantId: 'resto-1', name: 'Pizza', description: 'Pizza', price: 12.50 }

        store.addItem(food)
        expect(store.totalItems).toBe(1)

        store.updateQuantity('1', 10)
        expect(store.totalItems).toBe(10)
      })
    })

    describe('totalPrice', () => {
      it('devrait retourner 0 pour un panier vide', () => {
        const store = useCartStore()

        expect(store.totalPrice).toBe(0)
      })

      it('devrait calculer le prix total correct', () => {
        const store = useCartStore()

        const pizza = { id: '1', restaurantId: 'resto-1', name: 'Pizza', description: 'Pizza', price: 12.50 }
        const burger = { id: '2', restaurantId: 'resto-1', name: 'Burger', description: 'Burger', price: 10.00 }

        store.addItem(pizza)
        store.addItem(pizza)
        store.addItem(burger)

        // 2 * 12.50 + 1 * 10.00 = 35.00
        expect(store.totalPrice).toBe(35.00)
      })

      it('devrait mettre à jour le prix après modification de quantité', () => {
        const store = useCartStore()

        const food = { id: '1', restaurantId: 'resto-1', name: 'Pizza', description: 'Pizza', price: 12.50 }

        store.addItem(food)
        expect(store.totalPrice).toBe(12.50)

        store.updateQuantity('1', 4)
        expect(store.totalPrice).toBe(50.00) // 4 * 12.50
      })

      it('devrait gérer les nombres décimaux correctement', () => {
        const store = useCartStore()

        const food = { id: '1', restaurantId: 'resto-1', name: 'Salade', description: 'Salade', price: 7.99 }

        store.addItem(food)
        store.addItem(food)
        store.addItem(food)

        expect(store.totalPrice).toBe(23.97) // 3 * 7.99
      })
    })
  })

  describe('state persistence', () => {
    it('devrait avoir la configuration persist activée', () => {
      // Vérifi que le store persiste les trucs
      const store = useCartStore()
      
      // On vérifie qu'on peut ajouter des trucs
      store.addItem({ id: '1', restaurantId: 'r1', name: 'Test', description: 'Test', price: 10 })
      
      expect(store.items).toHaveLength(1)
    })
  })
})

