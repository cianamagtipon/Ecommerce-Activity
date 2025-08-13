import { defineStore } from 'pinia'
import type { User } from '@/types/user'

function getStoredUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem('Users') || '[]') as User[]
  } catch (e) {
    console.warn('Failed to parse stored users:', e)
    return []
  }
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
        if (typeof user.address === 'string') {
          user.address = { home: user.address }
        }

        this.currentUser = user
        localStorage.setItem('CurrentUser', JSON.stringify(user))
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

      if (typeof user.address === 'string') {
        user.address = { home: user.address }
      }

      users.push(user)
      setStoredUsers(users)

      localStorage.setItem('CurrentUser', JSON.stringify(user))
      this.currentUser = user
      return true
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('CurrentUser')
      localStorage.setItem('logout', Date.now().toString())
      console.info('[UserStore] Logged out successfully.')
    },

    loadUserFromStorage() {
      const stored = localStorage.getItem('CurrentUser')
      if (stored) {
        try {
          const user = JSON.parse(stored) as User
          if (typeof user.address === 'string') {
            user.address = { home: user.address }
          }
          this.currentUser = user
        } catch (e) {
          console.warn('Failed to load user from storage:', e)
        }
      }
    },

    updateUserData(updateData: Partial<User>) {
      const users = getStoredUsers()
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
        setStoredUsers(users)
        localStorage.setItem('CurrentUser', JSON.stringify(this.currentUser))
      }
    },
  },

  persist: true,
})
