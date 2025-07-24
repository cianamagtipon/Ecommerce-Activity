<script setup lang="ts">
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import Login from './components/auth/Login.vue'
import Register from './components/auth/Register.vue'
import Footer from './components/Footer.vue'

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/pinia/user'

const showLogin = ref(false)
const showRegister = ref(false)

function openLogin() {
  showLogin.value = true
}

function openRegister() {
  showRegister.value = true
}

const userStore = useUserStore()

function handleLogout() {
  userStore.logout()
}

const route = useRoute()
</script>

<template>
  <div class="app">
    <div v-if="route.name !== 'error'">
      <div class="header">
        <Header
          @login-clicked="openLogin"
          @signup-clicked="openRegister"
          @logout-clicked="handleLogout"
        ></Header>
      </div>

      <div class="menu">
        <Menu></Menu>
      </div>
    </div>

    <div class="main">
      <RouterView />
    </div>

    <Login v-model:dialog-visible="showLogin" />
    <Register v-model:dialog-visible="showRegister" />
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
