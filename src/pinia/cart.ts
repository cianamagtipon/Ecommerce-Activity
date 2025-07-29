import { defineStore } from 'pinia'
import type { Product } from '@/types/product'
import { useUserStore } from './user'

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

    selectedItemsDetails(state) {
      return state.items.filter((item) =>
        state.selectedISBNs.has(item.product.isbn),
      )
    },
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
      this.saveCartToStorage()
    },

    removeFromCart(isbn: string) {
      this.items = this.items.filter((item) => item.product.isbn !== isbn)
      this.selectedISBNs.delete(isbn)
      this.saveCartToStorage()
    },

    updateQuantity(isbn: string, quantity: number) {
      const item = this.items.find((item) => item.product.isbn === isbn)
      if (item) item.quantity = quantity
      this.saveCartToStorage()
    },

    clearCart() {
      this.items = []
      this.selectedISBNs.clear()
      this.saveCartToStorage()
    },

    toggleSelectAll() {
      const allSelected = this.items.every((item) =>
        this.selectedISBNs.has(item.product.isbn),
      )

      if (allSelected) {
        this.selectedISBNs.clear()
      } else {
        this.selectedISBNs = new Set(
          this.items.map((item) => item.product.isbn),
        )
      }
    },

    getSelectedItems() {
      return this.items
        .filter((item) => this.selectedISBNs.has(item.product.isbn))
        .map((item) => ({
          isbn: item.product.isbn,
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.retail * (1 - item.product.discount / 100),
        }))
    },

    clearSelected() {
      this.selectedISBNs.clear()
      this.saveCartToStorage()
    },

    removeItems(isbns: Set<string>) {
      this.items = this.items.filter((item) => !isbns.has(item.product.isbn))
    },

    saveCartToStorage() {
      const userStore = useUserStore()
      const key = `cart-${userStore.currentUser?.email || 'guest'}`
      const plainData = {
        items: this.items,
        selectedISBNs: Array.from(this.selectedISBNs),
      }
      localStorage.setItem(key, JSON.stringify(plainData))
    },

    loadCartFromStorage() {
      const userStore = useUserStore()
      const key = `cart-${userStore.currentUser?.email || 'guest'}`
      const raw = localStorage.getItem(key)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        this.items = parsed.items || []
        this.selectedISBNs = new Set(parsed.selectedISBNs || [])
      } catch (e) {
        console.error('Failed to load cart:', e)
      }
    },
  },
})
