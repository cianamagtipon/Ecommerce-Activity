<script setup>
import Home from '../Home.vue'
</script>

<template>
  <transition name="home-fade" appear>
    <div class="home" key="home">
      <Home />
    </div>
  </transition>
</template>

<style scoped>
.home-fade-enter-active,
.home-fade-leave-active {
  transition: all 0.4s ease;
}

.home-fade-enter-from,
.home-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
