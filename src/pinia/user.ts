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
    phone: (state): string => state.currentUser?.phone ?? '',

    address: (state): User['address'] =>
      state.currentUser?.address ?? undefined,

    fullAddress: (state): string => {
      const addr = state.currentUser?.address
      if (!addr || typeof addr !== 'object') return ''
      return [addr.home, addr.city, addr.province, addr.zip]
        .filter(Boolean)
        .join(', ')
    },
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
        // convert legacy string address to object if needed
        if (typeof user.address === 'string') {
          user.address = { home: user.address }
        }

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

      // if address is missing or a string, convert it
      if (typeof user.address === 'string') {
        user.address = { home: user.address }
      }

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
      const stored = localStorage.getItem('CurrentUser')
      if (stored) {
        const user = JSON.parse(stored) as User

        // convert legacy string address
        if (typeof user.address === 'string') {
          user.address = { home: user.address }
        }

        this.currentUser = user
      }
    },

    updateUserData(updateData: Partial<User>) {
      const users = JSON.parse(localStorage.getItem('Users') || '[]')
      const idx = users.findIndex(
        (u: User) => u.email === this.currentUser?.email,
      )

      if (idx !== -1) {
        const oldUser = users[idx]
        const oldAddress = oldUser.address || {}
        const newAddress = updateData.address || {}

        users[idx] = {
          ...oldUser,
          ...updateData,
          address: {
            ...oldAddress,
            ...newAddress,
          },
        }

        this.currentUser = users[idx]
        localStorage.setItem('Users', JSON.stringify(users))
        localStorage.setItem('CurrentUser', JSON.stringify(this.currentUser))
      }
    },
  },

  persist: true,
})
