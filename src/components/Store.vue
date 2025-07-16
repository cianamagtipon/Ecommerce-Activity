<script setup lang="ts">
import { useProductStore } from '@/pinia/products'
import { onMounted } from 'vue'
import StoreCards from './store/StoreCards.vue'

const productStore = useProductStore()

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})
</script>

<template>
  <StoreCards :products="productStore.products" />
</template>
