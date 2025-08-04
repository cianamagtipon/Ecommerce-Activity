<script setup lang="ts">
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import Login from './components/auth/Login.vue'
import Footer from './components/Footer.vue'

import { ref, onBeforeMount, onUnmounted, onMounted } from 'vue'
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

onMounted(() => {
  router.afterEach(() => {
    const main = document.querySelector('.main')
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
})
</script>

<template>
  <div class="app">
    <div v-if="route.name !== 'error'" class="top">
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
          <Menu
            @login-clicked="openLogin"
            @signup-clicked="openRegister"
            @logout-clicked="handleLogout"
          />
        </div>
      </div>
    </div>

    <div class="main">
      <div class="container">
        <RouterView :key="$route.fullPath" />
      </div>

      <div class="footer" v-if="route.name !== 'error'">
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

@media (max-width: 600px) {
  .main {
    padding: 1rem;
  }

  .top {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);

    padding-bottom: 0.2rem;
  }
}
</style>
