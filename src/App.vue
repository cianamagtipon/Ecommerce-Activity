<script setup lang="ts">
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import Login from './components/auth/Login.vue'
import Register from './components/auth/Register.vue'
import Footer from './components/Footer.vue'

import { ref, onBeforeMount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/pinia/user'
import { useCartStore } from '@/pinia/cart'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const cartStore = useCartStore()

const { isLoggedIn, name } = storeToRefs(userStore)
const loginJustSucceeded = ref(false)
const registerJustSucceeded = ref(false)

const showLogin = ref(false)
const showRegister = ref(false)

function openLogin() {
  showLogin.value = true
}

function openRegister() {
  showRegister.value = true
}

function handleDialogClosed(flag: 'login' | 'register') {
  const successRef =
    flag === 'login' ? loginJustSucceeded : registerJustSucceeded
  if (successRef.value) {
    userStore.loadUserFromStorage()
    cartStore.loadCartFromStorage()
    successRef.value = false
  }
}

function handleLogout() {
  userStore.logout()
  window.location.reload()
}

const route = useRoute()

onBeforeMount(async () => {
  userStore.loadUserFromStorage()
  await nextTick()
  cartStore.loadCartFromStorage()
})
</script>

<template>
  <div class="app">
    <div v-if="route.name !== 'error'">
      <div class="header">
        <div class="container">
          <Header
            @login-clicked="openLogin"
            @signup-clicked="openRegister"
            @logout-clicked="handleLogout"
          ></Header>
        </div>
      </div>

      <div class="menu">
        <div class="container">
          <Menu></Menu>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="container">
        <transition name="fade" mode="out-in">
          <RouterView :key="$route.fullPath" />
        </transition>
      </div>
    </div>

    <Login
      v-model:dialog-visible="showLogin"
      @login-success="loginJustSucceeded = true"
      @closed="() => handleDialogClosed('login')"
    />

    <Register
      v-model:dialog-visible="showRegister"
      @register-success="registerJustSucceeded = true"
      @closed="() => handleDialogClosed('register')"
    />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.container {
  max-width: 1440px;
  width: 100%;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
}

.menu {
  position: sticky;
  top: 60px;
  z-index: 999;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding-right: 1rem;
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
