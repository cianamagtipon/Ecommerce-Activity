export type OrderStatus = 'pending' | 'shipped' | 'delivered'

export type OrderItem = {
  isbn: string
  title: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  date: Date
  items: OrderItem[]
  total: number
  status: OrderStatus
  notes?: string
}
