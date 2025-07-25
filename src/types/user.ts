import type { Order } from './order'
import type { Product } from './product'

export interface User {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  userOrders?: Order[] // optional: can be used or left unused
}
