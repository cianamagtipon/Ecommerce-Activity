import type { Genre } from './genre'

export type Product = {
  isbn: string
  title: string
  author: string
  genre: Genre
  publishDate: Date
  retail: number
  discount: number
  rating: number
}
