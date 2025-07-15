import { defineStore } from 'pinia'
import type { Product, Genre } from '@/types/genre'
import { inventory } from '@/assets/data/inventory'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
  }),

  getters: {
    getByGenre: (state) => (genre: Genre) =>
      state.products.filter((product) => product.genre === genre),

    totalProducts: (state) => state.products.length,

    discountedProducts: (state) => state.products.filter((p) => p.discount > 0),
  },

  actions: {
    loadMockData() {
      this.products = inventory.map((p) => ({
        ...p,
        genre: p.genre as Genre,
        publishDate: new Date(p.publishDate),
      }))
    },

    addProduct(product: Product) {
      this.products.push(product)
    },

    removeProduct(isbn: string) {
      this.products = this.products.filter((p) => p.isbn !== isbn)
    },

    clearProducts() {
      this.products = []
    },
  },

  persist: {
    key: 'store',
    storage: localStorage,
  },
})
