import { defineStore } from 'pinia'
import type { User } from '@/types/user'

function getStoredUsers(): User[] {
  return JSON.parse(localStorage.getItem('Users') || '[]') as User[]
}

function setStoredUsers(users: User[]) {
  localStorage.setItem('Users', JSON.stringify(users))
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
  }),

  getters: {
    isLoggedIn: (state): boolean => !!state.currentUser,
    name: (state): string => state.currentUser?.name ?? '',
    email: (state): string => state.currentUser?.email ?? '',
    address: (state): string => state.currentUser?.address ?? '',
    phone: (state): string => state.currentUser?.phone ?? '',
  },

  actions: {
    login(email: string, password: string): boolean {
      const users = getStoredUsers()
      const normalizedEmail = email.trim().toLowerCase()

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === normalizedEmail && u.password === password,
      )

      if (user) {
        this.currentUser = user
        localStorage.setItem('currentUser', user.email)
        return true
      }

      return false
    },

    register(user: User): boolean {
      const users = getStoredUsers()
      const normalizedEmail = user.email.trim().toLowerCase()

      const exists = users.some(
        (u) => u.email.toLowerCase() === normalizedEmail,
      )
      if (exists) return false

      user.email = normalizedEmail
      users.push(user)
      setStoredUsers(users)
      localStorage.setItem('currentUser', user.email)

      this.currentUser = user
      return true
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('currentUser')
    },

    loadUserFromStorage() {
      const email = localStorage.getItem('currentUser')
      if (email) {
        const users = getStoredUsers()
        const user = users.find((u) => u.email === email)
        if (user) {
          this.currentUser = user
        }
      }
    },

    updateUserData(newData: Partial<User>) {
      if (!this.currentUser) return

      const users = getStoredUsers()
      const idx = users.findIndex((u) => u.email === this.currentUser!.email)

      if (idx !== -1) {
        users[idx] = { ...users[idx], ...newData }
        this.currentUser = users[idx]
        setStoredUsers(users)
      }
    },
  },

  persist: true,
})
