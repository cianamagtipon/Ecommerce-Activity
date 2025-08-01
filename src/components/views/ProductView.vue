<script setup lang="ts">
import Product from '../store/Product.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
</script>

<template>
  <transition name="product-fade" appear>
    <div class="product" :key="id">
      <Product :id="id" />
    </div>
  </transition>
</template>

<style scoped>
.product-fade-enter-active,
.product-fade-leave-active {
  transition: all 0.4s ease;
}

.product-fade-enter-from,
.product-fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
