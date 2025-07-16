<script setup>
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import Login from './components/auth/Login.vue'
import Footer from './components/Footer.vue'

import { ref } from 'vue'
import { useRoute } from 'vue-router'

const showLogin = ref(false)

function openLogin() {
  showLogin.value = true
}

const route = useRoute()
</script>

<template>
  <div class="app">
    <div v-if="route.name !== 'error'">
      <div class="header">
        <Header @login-clicked="openLogin"></Header>
      </div>

      <div class="menu">
        <Menu></Menu>
      </div>
    </div>

    <div class="main">
      <RouterView />
    </div>

    <Login v-model:dialog-visible="showLogin" />
    <!-- <div class="footer">
      <Footer></Footer>
    </div> -->
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
  display: flex;
  justify-content: center;
}
</style>
