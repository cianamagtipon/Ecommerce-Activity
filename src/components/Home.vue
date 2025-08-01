<script setup lang="ts">
import Carousel from './home/Carousel.vue'
import Suggestion from './home/Suggestion.vue'
</script>

<template>
  <Carousel />

  <div class="section-divider">
    <h2 class="divider-title">Recommended Just for You</h2>
    <p class="divider-subtitle">A selection for every kind of reader</p>
  </div>

  <Suggestion />
</template>

<style scoped>
.section-divider {
  text-align: center;
  margin: 4rem 0 2rem;
}

.divider-title {
  font-size: 1.7rem;
  font-weight: 600;
  color: #5d3d2e;
  margin-bottom: 0.4rem;
}

.divider-subtitle {
  font-size: 0.9rem;
  color: #a96f49;
  opacity: 0.85;
}
</style>
