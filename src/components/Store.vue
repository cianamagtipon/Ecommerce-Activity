<script setup lang="ts">
import { useProductStore } from '@/pinia/products'
import { onMounted } from 'vue'
import Cards from './store/Cards.vue'

const productStore = useProductStore()

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})
</script>

<template>
  <Cards :products="productStore.products" />
</template>
