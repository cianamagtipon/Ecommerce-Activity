<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProductStore } from '@/pinia/products'
import { computed, onMounted } from 'vue'
import StoreCards from './StoreCards.vue'
import type { Genre } from '@/types/product'

const route = useRoute()
const productStore = useProductStore()

// get genre from URL
const genre = computed(() => route.params.genre as Genre | undefined)

// filtered products by genre
const filteredProducts = computed(() => {
  if (!genre.value || genre.value.toLowerCase() === 'all') {
    return productStore.products
  }
  return productStore.products.filter(
    (p) => p.genre.toLowerCase() === genre.value?.toLowerCase(),
  )
})

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})
</script>

<template>
  <h2 v-if="genre">{{ genre }} books</h2>
  <StoreCards :products="filteredProducts" />
</template>
