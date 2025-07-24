import { defineStore } from 'pinia'
import { useUserListStore } from './userlist'
import type { UserData } from '@/types/users'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    isLoggedIn: false,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    userEmail: (state) => state.email,
    userName: (state) => state.name,
  },

  actions: {
    syncWithUserList() {
      const userlistStore = useUserListStore()
      if (userlistStore.isLoggedIn && userlistStore.currentUser) {
        const u = userlistStore.currentUser
        this.name = u.name
        this.email = u.email
        this.password = u.password
        this.phone = u.phone || ''
        this.address = u.address || ''
        this.isLoggedIn = true
      } else {
        this.$reset()
      }
    },

    login(email: string, password: string): boolean {
      const userlistStore = useUserListStore()
      const success = userlistStore.login(email, password)
      if (success) this.syncWithUserList()
      else this.$reset()
      return success
    },

    logout() {
      const userlistStore = useUserListStore()
      userlistStore.logout()
      this.$reset()
    },

    register(user: UserData) {
      const userlistStore = useUserListStore()
      userlistStore.register(user)
      this.syncWithUserList()
    },
  },

  persist: {
    key: 'user',
    storage: localStorage,
  },
})
