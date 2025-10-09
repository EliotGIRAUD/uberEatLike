import { defineStore } from 'pinia'
import type { CartItem } from './cart'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'

export interface Order {
  id: number
  userId: string
  items: CartItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: string
}

interface OrderState {
  orders: Order[]
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
  }),
  getters: {
    userOrders: (state) => (userEmail: string) => {
      return state.orders.filter(order => order.userId === userEmail)
    },
    getOrderById: (state) => (orderId: number) => {
      return state.orders.find(order => order.id === orderId)
    },
  },
  actions: {
    createOrder(userEmail: string, items: CartItem[], totalPrice: number): Order {
      const newOrder: Order = {
        id: Date.now(),
        userId: userEmail,
        items: items.map(item => ({ ...item })),
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      this.orders.push(newOrder)
      return newOrder
    },
    updateOrderStatus(orderId: number, status: OrderStatus) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
      }
    },
  },
  persist: true,
})

