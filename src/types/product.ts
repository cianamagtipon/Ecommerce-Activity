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

export type Genre =
  | 'Fiction'
  | 'Nonfiction'
  | 'Romance'
  | 'Mystery'
  | 'Thriller'
  | 'Fantasy'
  | 'Science Fiction'
  | 'Historical'
  | 'Young Adult'
  | 'Children'
  | 'Biography'
  | 'Memoir'
  | 'Self-Help'
  | 'Health & Wellness'
  | 'Business'
  | 'Poetry'
  | 'Comics & Graphic Novels'
  | 'Religion & Spirituality'
  | 'Cookbooks'
  | 'Education'
  | 'Travel'
  | 'Art & Photography'
  | 'Classic'
