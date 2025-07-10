<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, House, Collection } from '@element-plus/icons-vue'

// Dummy fullscreen loading
const fullscreenLoading = ref(false)

const route = useRoute()
const router = useRouter()

const activeIndex = ref('1')
const isMobile = ref(window.innerWidth <= 768)
const isTinyScreen = ref(window.innerWidth < 400)
const isDrawerVisible = ref(false)

const updateScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}
const updateTinyScreen = () => {
  isTinyScreen.value = window.innerWidth < 400
}

const handleSelect = (key: string) => {
  activeIndex.value = key
  if (key === '1') router.push('/home')
  else if (key === '2-1') router.push('/store')
  else if (key === '2-2' || key === '2-3') {
    // Placeholder click
    console.log('Clicked:', key)
  }
  isDrawerVisible.value = false
}

const toggleDrawer = () => {
  isDrawerVisible.value = !isDrawerVisible.value
}

let scrollBarWidth = 0
const lockBodyScroll = () => {
  const body = document.body
  void body.offsetWidth
  scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
  body.style.overflow = 'hidden'
  if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`
}

const unlockBodyScroll = () => {
  const body = document.body
  setTimeout(() => {
    body.style.overflow = ''
    body.style.paddingRight = ''
  }, 0)
}

watch(
  () => route.name,
  (name) => {
    if (name === 'login') document.body.classList.add('login-bg')
    else document.body.classList.remove('login-bg')
  },
  { immediate: true },
)

onMounted(() => {
  updateScreenSize()
  updateTinyScreen()
  window.addEventListener('resize', updateScreenSize)
  window.addEventListener('resize', updateTinyScreen)
})

watch(
  () => route.name,
  (newName) => {
    if (newName === 'home') activeIndex.value = '1'
    else if (newName === 'store') activeIndex.value = '2-1'
    else activeIndex.value = ''
  },
  { immediate: true },
)

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
  window.removeEventListener('resize', updateTinyScreen)
})
</script>

<template>
  <div class="app-container">
    <div v-loading.fullscreen.lock="fullscreenLoading">
      <!-- Desktop Navbar-->
      <el-menu
        v-if="!isMobile"
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="1">Home</el-menu-item>
        <el-menu-item index="2-1">Store</el-menu-item>

        <div class="menu-spacer"></div>
        <el-sub-menu index="2">
          <template #title>Menu</template>
          <el-menu-item index="2-2">Reset</el-menu-item>
          <el-menu-item class="logout-item" index="2-3" style="color: #ff2200af; font-weight: 600"
            >Logout</el-menu-item
          >
        </el-sub-menu>
      </el-menu>

      <!-- Mobile Navbar -->
      <div v-else class="mobile-navbar">
        <div class="logo-text" @click="handleSelect('1')">Student Registration</div>

        <el-icon @click="toggleDrawer" class="menu-button">
          <Menu />
        </el-icon>

        <el-drawer
          v-model="isDrawerVisible"
          direction="ltr"
          size="200px"
          with-header="false"
          :modal="true"
          append-to-body="false"
          @opened="lockBodyScroll"
          @closed="unlockBodyScroll"
        >
          <div class="drawer-container">
            <el-menu
              :default-active="activeIndex"
              class="vertical-menu drawer-menu"
              mode="vertical"
              @select="handleSelect"
            >
              <el-menu-item index="1">
                <el-icon><House /></el-icon>
                Home
              </el-menu-item>
              <el-menu-item index="2-1">
                <el-icon><Collection /></el-icon>
                Store
              </el-menu-item>
            </el-menu>

            <el-menu class="vertical-menu action-menu" mode="vertical" @select="handleSelect">
              <el-menu-item index="2-2">Reset</el-menu-item>
              <el-menu-item index="2-3" class="logout-item">Logout</el-menu-item>
            </el-menu>
          </div>
        </el-drawer>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
.menu-spacer {
  flex: 1;
}

.main {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

/* ────────────────────────
  NAVBAR STYLES
────────────────────────── */

.mobile-navbar {
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #6b91ed 0%, #00b1b1 60%);
  box-shadow:
    5px 10px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}

/* BUTTON */
.menu-button {
  margin-left: 1rem;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.home-button {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  transition: background 0.3s;
}

.logout-item {
  color: #ff2200af !important;
  font-weight: 600;
}

.logout-item:hover {
  background-color: #fdecea !important;
}

/* LOGO */
.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

/* ────────────────────────
  DRAWER
────────────────────────── */

.drawer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vertical-menu {
  border: none !important;
}

.drawer-menu {
  flex-grow: 1;
}

.action-menu {
  border-top: 1px solid #e4e7ed;
  padding-top: 0.5rem;
}
</style>
