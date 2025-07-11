<script setup>
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app">
    <div v-if="route.name !== 'error'">
      <div class="header">
        <Header></Header>
      </div>

      <div class="menu">
        <Menu></Menu>
      </div>
    </div>

    <div class="main">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header,
.menu {
  width: 100%;
}

.main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}
</style>
