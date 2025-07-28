import { defineStore } from 'pinia'
import type { Product } from '@/types/product'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    selectedItems: [] as { product: Product; quantity: number }[],
  }),

  actions: {
    setSelectedItems(items: { product: Product; quantity: number }[]) {
      this.selectedItems = items
    },

    clearSelectedItems() {
      this.selectedItems = []
    },
  },

  persist: {
    key: 'checkout',
    storage: localStorage,
  },
})
