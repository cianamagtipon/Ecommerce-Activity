import type { Order } from './order'

export interface User {
  name: string
  email: string
  password: string
  phone?: string
  address?: {
    province?: string
    city?: string
    zip?: string
    home?: string
  }
  userOrders?: Order[]
}
