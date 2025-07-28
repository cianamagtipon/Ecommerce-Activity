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
