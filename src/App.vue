<script setup>
import Menu from './components/Menu.vue'
</script>

<template>
  <div class="app">
    <Menu></Menu>
  </div>

  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: center;
}
</style>
