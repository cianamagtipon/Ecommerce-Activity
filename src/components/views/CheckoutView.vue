<script setup lang="ts">
import Checkout from '../Checkout.vue'
</script>

<template>
  <transition name="checkout-fade" appear>
    <div key="checkout">
      <Checkout />
    </div>
  </transition>
</template>

<style scoped>
.checkout-fade-enter-active,
.checkout-fade-leave-active {
  transition: all 0.4s ease;
}

.checkout-fade-enter-from,
.checkout-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
