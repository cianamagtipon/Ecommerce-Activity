import { defineStore } from 'pinia'
import type { Product } from '@/types/genre'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as { product: Product; quantity: number }[],
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce(
        (total, item) =>
          total +
          item.product.retail *
            (1 - item.product.discount / 100) *
            item.quantity,
        0,
      ),
  },

  actions: {
    addToCart(product: Product, quantity = 1) {
      const existing = this.items.find(
        (item) => item.product.isbn === product.isbn,
      )
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
    },

    removeFromCart(isbn: string) {
      this.items = this.items.filter((item) => item.product.isbn !== isbn)
    },

    updateQuantity(isbn: string, quantity: number) {
      const item = this.items.find((item) => item.product.isbn === isbn)
      if (item) item.quantity = quantity
    },

    clearCart() {
      this.items = []
    },
  },

  persist: {
    key: 'cart', // storage key name
    storage: localStorage, // or sessionStorage
  },
})
