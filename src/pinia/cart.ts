import { defineStore } from 'pinia'
import type { Product } from '@/types/genre'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as { product: Product; quantity: number }[],
    selectedISBNs: new Set<string>(),
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

    isAllSelected: (state) =>
      state.items.length > 0 &&
      state.items.every((item) => state.selectedISBNs.has(item.product.isbn)),
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
      this.selectedISBNs = new Set(
        [...this.selectedISBNs].filter((id) => id !== isbn),
      )
    },

    updateQuantity(isbn: string, quantity: number) {
      const item = this.items.find((item) => item.product.isbn === isbn)
      if (item) item.quantity = quantity
    },

    clearCart() {
      this.items = []
      this.selectedISBNs.clear()
    },

    toggleSelectAll() {
      const allSelected = this.items.every((item) =>
        this.selectedISBNs.has(item.product.isbn),
      )

      if (allSelected) {
        this.selectedISBNs = new Set()
      } else {
        this.selectedISBNs = new Set(
          this.items.map((item) => item.product.isbn),
        )
      }
    },
  },

  persist: {
    key: 'cart',
    storage: localStorage,
    serializer: {
      serialize: (value) =>
        JSON.stringify({
          ...value,
          selectedISBNs: Array.from(value.selectedISBNs),
        }),
      deserialize: (value) => {
        const parsed = JSON.parse(value)
        parsed.selectedISBNs = new Set(parsed.selectedISBNs)
        return parsed
      },
    },
  },
})
