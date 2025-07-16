<script setup lang="ts">
import { useCartStore } from '@/pinia/cart'
import CartCards from './cart/CartCards.vue'
import { computed } from 'vue'

const cartStore = useCartStore()

// Extract product objects from cart items
const cartProducts = computed(() => cartStore.items.map((item) => item.product))
</script>

<template>
  <CartCards :products="cartProducts" />
</template>
