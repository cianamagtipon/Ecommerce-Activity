<script setup lang="ts">
import Cart from '@/components/Cart.vue'
</script>

<template>
  <transition name="cart-fade" appear>
    <div class="cart" key="cart">
      <Cart />
    </div>
  </transition>
</template>

<style scoped>
.cart-fade-enter-active,
.cart-fade-leave-active {
  transition: all 0.4s ease;
}

.cart-fade-enter-from,
.cart-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
