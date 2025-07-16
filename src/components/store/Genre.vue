<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProductStore } from '@/pinia/products'
import { computed, onMounted } from 'vue'
import Cards from './store/Cards.vue'
import type { Genre } from '@/types/genre'

const route = useRoute()
const productStore = useProductStore()

// gets genre from url (e.g., /store/fiction)
const genre = computed(() => route.params.genre as Genre)

// filters products by genre
const filteredProducts = computed(() =>
  productStore.products.filter(
    (p) => p.genre.toLowerCase() === genre.value.toLowerCase(),
  ),
)

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})
</script>

<template>
  <h2>{{ genre }} books</h2>
  <Cards :products="filteredProducts" />
</template>
