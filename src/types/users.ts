export interface UserData {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
}

export let users: Record<string, UserData> = {}
