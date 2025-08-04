import type { Product } from '@/types/product'

export function useProductTags() {
  function isNewArrival(product: Product): boolean {
    return new Date(product.publishDate).getFullYear() >= 2020
  }

  function isBestSeller(product: Product): boolean {
    return product.rating >= 3.5
  }

  return { isNewArrival, isBestSeller }
}
