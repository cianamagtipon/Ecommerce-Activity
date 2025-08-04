<!-- src/components/cart/CartHeader.vue -->
<script setup lang="ts">
import { useCartStore } from '@/pinia/cart'

const cartStore = useCartStore()
</script>

<template>
  <div class="cart-header" :class="{ centered: cartStore.items.length === 0 }">
    <h2>Your Cart</h2>
    <span
      v-if="cartStore.items.length === 0"
      class="total-amount"
      style="display: none"
    ></span>
    <span v-else>
      <strong>Total:</strong> ₱{{ cartStore.totalPrice.toFixed(2) }}
    </span>
  </div>
</template>

<style scoped>
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 1rem;
}

.cart-header.centered {
  justify-content: center;
  text-align: center;
}

.cart-header.centered h2 {
  flex: 1;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #3b2a22;
}

.total-amount {
  font-size: 1.2rem;
  white-space: nowrap;
}

@media (max-width: 500px) {
  .cart-header {
    padding: 0;
    padding-bottom: 0.5rem;
  }
}
</style>
