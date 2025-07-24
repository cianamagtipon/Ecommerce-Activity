import { defineStore } from 'pinia'
import type { Order, OrderItem } from '@/types/order'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: {} as Record<string, Order[]>,
  }),

  getters: {
    getOrdersByUser: (state) => {
      return (email: string) => state.orders[email] || []
    },
  },

  actions: {
    placeOrder(
      selectedItems: { product: any; quantity: number }[],
      userEmail: string,
    ) {
      const orderItems: OrderItem[] = selectedItems.map((item) => ({
        isbn: item.product.isbn,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.retail * (1 - item.product.discount / 100),
      }))

      const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )

      const newOrder: Order = {
        id: crypto.randomUUID(),
        date: new Date(),
        items: orderItems,
        total,
      }

      if (!this.orders[userEmail]) {
        this.orders[userEmail] = []
      }

      this.orders[userEmail].push(newOrder)
    },

    clearOrders(email: string) {
      delete this.orders[email]
    },
  },

  persist: {
    key: 'orders',
    storage: localStorage,
    serializer: {
      serialize: JSON.stringify,
      deserialize: (value: string) => {
        const parsed = JSON.parse(value)
        if (parsed.orders && typeof parsed.orders === 'object') {
          const converted: Record<string, Order[]> = {}
          for (const key in parsed.orders) {
            converted[key] = parsed.orders[key].map((order: any) => ({
              ...order,
              date: new Date(order.date),
            }))
          }
          return { orders: converted }
        }
        return { orders: {} }
      },
    },
  },
})
