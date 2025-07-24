import { defineStore } from 'pinia'
import type { UserData } from '@/types/users'
import { useCartStore } from './cart'
import { useOrderStore } from './orders'

export const useUserListStore = defineStore('userlist', {
  state: () => ({
    users: {} as Record<string, UserData>,
    currentUser: null as UserData | null,
    isLoggedIn: false,
  }),

  actions: {
    loadUsers() {
      const usersRaw = localStorage.getItem('users')
      if (usersRaw) {
        try {
          const parsed = JSON.parse(usersRaw)
          this.users = parsed.users ?? parsed ?? {}
        } catch {
          this.users = {}
        }
      }
    },

    saveUsers() {
      localStorage.setItem('users', JSON.stringify({ users: this.users }))
    },

    addUser(user: UserData) {
      this.users[user.email] = user
      this.saveUsers()
    },

    getUser(email: string): UserData | undefined {
      return this.users[email]
    },

    hasUser(email: string): boolean {
      return !!this.users[email]
    },

    login(email: string, password: string): boolean {
      this.loadUsers()
      const user = this.getUser(email)
      if (!user || user.password !== password) {
        this.currentUser = null
        this.isLoggedIn = false
        return false
      }

      this.currentUser = user
      this.isLoggedIn = true

      // Load user's cart
      const cartStore = useCartStore()
      const cartKey = `cart-${email}`
      const savedCartRaw = localStorage.getItem(cartKey)
      if (savedCartRaw) {
        try {
          const parsed = JSON.parse(savedCartRaw)
          parsed.selectedISBNs = new Set(parsed.selectedISBNs)
          cartStore.$patch(parsed)
        } catch {
          cartStore.clearCart()
        }
      } else {
        cartStore.clearCart()
      }

      // Load user's orders
      const orderStore = useOrderStore()
      const orderKey = 'orders'
      const savedOrdersRaw = localStorage.getItem(orderKey)
      if (savedOrdersRaw) {
        try {
          const parsedOrders = JSON.parse(savedOrdersRaw)
          if (parsedOrders.orders && parsedOrders.orders[email]) {
            orderStore.orders[email] = parsedOrders.orders[email].map(
              (order: any) => ({ ...order, date: new Date(order.date) }),
            )
          } else {
            orderStore.orders[email] = []
          }
        } catch {
          orderStore.orders[email] = []
        }
      } else {
        orderStore.orders[email] = []
      }

      return true
    },

    logout() {
      if (!this.currentUser) return
      const cartStore = useCartStore()
      cartStore.clearCart()
      const cartKey = `cart-${this.currentUser.email || 'guest'}`
      localStorage.removeItem(cartKey)

      const orderStore = useOrderStore()
      orderStore.clearOrders(this.currentUser.email)

      this.currentUser = null
      this.isLoggedIn = false
    },

    register(user: UserData) {
      this.loadUsers()
      if (this.hasUser(user.email)) {
        throw new Error('User already exists')
      }
      this.addUser(user)

      this.currentUser = user
      this.isLoggedIn = true
    },
  },

  persist: {
    key: 'users',
    storage: localStorage,
  },
})
