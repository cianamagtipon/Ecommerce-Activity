<script setup lang="ts">
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import Login from './components/auth/Login.vue'
import Footer from './components/Footer.vue'

import { ref, onBeforeMount, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/pinia/user'
import { useCartStore } from '@/pinia/cart'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()

const { isLoggedIn, name } = storeToRefs(userStore)
const loginJustSucceeded = ref(false)

const showLogin = ref(false)

function openLogin() {
  showLogin.value = true
}

function openRegister() {
  router.push('/register') // redirect to Register view
}

window.openLoginModal = () => {
  console.log('openLoginModal called')
  showLogin.value = true
}

function handleDialogClosed() {
  if (loginJustSucceeded.value) {
    userStore.loadUserFromStorage()
    cartStore.loadCartFromStorage()
    loginJustSucceeded.value = false
  }
}

function handleLogout() {
  userStore.logout()
  router.push('/home')
}

const route = useRoute()

onBeforeMount(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const el = e.target as HTMLElement

      const isInLoginOrRegister =
        el.closest('.login-form') || el.closest('register')

      if (!isInLoginOrRegister) {
        e.preventDefault()
      }
    }
  }

  window.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
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
          />
        </div>
      </div>

      <div class="menu">
        <div class="container">
          <Menu />
        </div>
      </div>
    </div>

    <div class="main">
      <div class="container">
        <transition name="fade" mode="out-in">
          <RouterView :key="$route.fullPath" />
        </transition>
      </div>

      <div class="footer">
        <Footer />
      </div>
    </div>

    <!-- Login Modal -->
    <Login
      v-model:dialog-visible="showLogin"
      @login-success="loginJustSucceeded = true"
      @closed="handleDialogClosed"
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

.footer {
  margin-top: 2rem;
}

/* Transition styles */
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
