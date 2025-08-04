<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, UserFilled } from '@element-plus/icons-vue'
import { TagIcon, BookOpenIcon } from '@heroicons/vue/24/solid'
import { useScreenSize } from '@/composables/screenSize'
import { useUserStore } from '@/pinia/user'

import CartDropdown from '@/components/cart/CartDropdown.vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.currentUser)

const fullscreenLoading = ref(false)

const route = useRoute()
const router = useRouter()

const searchText = ref('')
const activeIndex = ref('1')
const { isMobile } = useScreenSize()
const isDrawerVisible = ref(false)

const handleSelect = (key: string) => {
  activeIndex.value = key
  if (key === '1-1') router.push('/home')
  else if (key === '1-2') router.push('/store')
  else if (key === '1-3') router.push('/profile')
  else if (key === '2-1' || key === '2-2') {
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

const syncActiveIndex = () => {
  const path = route.path.replace(/\/+$/, '') // remove trailing slash
  if (path === '/home') activeIndex.value = '1-1'
  else if (path.startsWith('/store') || path.startsWith('/genre'))
    activeIndex.value = '1-2'
  else if (path.startsWith('/profile')) activeIndex.value = '1-3'
  else activeIndex.value = ''
}

watch(() => route.path, syncActiveIndex, { immediate: true })
onMounted(syncActiveIndex)
</script>

<template>
  <div class="app-container">
    <div v-loading.fullscreen.lock="fullscreenLoading">
      <!-- Desktop Navbar-->
      <el-menu
        v-if="!isMobile"
        :default-active="activeIndex"
        class="desktop-navbar"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="1-1">Home</el-menu-item>
        <el-menu-item index="1-2">Store</el-menu-item>
        <el-menu-item index="1-3" v-if="isLoggedIn"> Profile </el-menu-item>

        <div class="menu-spacer"></div>
        <div class="cart-menu-wrapper">
          <CartDropdown />
        </div>
      </el-menu>

      <!-- Mobile Bottom Navbar -->
      <div v-else class="mobile-bottom-navbar">
        <div
          class="mobile-nav-item"
          :class="{ active: activeIndex === '1-1' }"
          @click="handleSelect('1-1')"
        >
          <el-icon><HomeFilled /></el-icon>
        </div>

        <div
          class="mobile-nav-item"
          :class="{ active: activeIndex === '1-2' }"
          @click="handleSelect('1-2')"
        >
          <el-icon><BookOpenIcon /></el-icon>
        </div>

        <div class="mobile-nav-item cart-icon">
          <CartDropdown />
        </div>

        <div
          v-if="isLoggedIn"
          class="mobile-nav-item"
          :class="{ active: activeIndex === '1-3' }"
          @click="handleSelect('1-3')"
        >
          <el-icon><UserFilled /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  padding-top: 0;
  margin-top: 0;
}

.menu-spacer {
  flex: 1;
}

:root {
  --el-color-primary: #5d3d2e;
}

/* or scoped override */
::v-deep(.el-menu-item.is-active),
::v-deep(.el-menu-item:hover),
::v-deep(.el-sub-menu__title.is-active) {
  background-color: transparent !important;
  color: #5d3d2e !important;
}

::v-deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: transparent !important;
  color: #5d3d2e !important;
}

::v-deep(.el-menu-item .el-icon) {
  color: inherit !important;
}

::v-deep(.el-menu-item),
::v-deep(.el-sub-menu__title) {
  color: #bba68b !important;
}

/* ANIMATION FOR SELECT */

::v-deep(.el-menu--horizontal > .el-menu-item) {
  position: relative;
  transition: color 0.3s ease;
}

::v-deep(.el-menu--horizontal > .el-menu-item::after) {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 25%;
  width: 55%;
  height: 2px;
  background-color: #5d3d2e;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease;
}

::v-deep(.el-menu--horizontal > .el-menu-item.is-active::after) {
  transform: scaleX(1);
}

/* ────────────────────────
  NAVBAR STYLES
────────────────────────── */

.mobile-bottom-navbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 100vw;
  height: 55px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  border-top: 1px solid #e5e5e5;
  z-index: 1000;
}

.mobile-nav-item {
  flex: 1;
  text-align: center;
  padding: 0.25rem 0;
  color: #bba68b;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.mobile-nav-item.active {
  color: #5d3d2e;
}

.cart-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.desktop-navbar {
  border: none !important;
  font-weight: 600;
}

.cart-menu-wrapper {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.mobile-bottom-navbar .el-icon,
.mobile-bottom-navbar svg {
  width: 22px;
  height: 22px;
}

/* BUTTON */
.menu-button {
  margin-left: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.search-bar {
  width: 240px;
}

.search-bar ::v-deep(.el-input__inner::placeholder) {
  color: #bba68b !important; /* Light brown or muted beige */
  opacity: 1 !important;
}

/* Input text color */
.search-bar ::v-deep(.el-input__inner) {
  color: #5d3d2e; /* Text color */
}

/* Search icon color */
.search-bar ::v-deep(.el-input__prefix .el-icon) {
  color: #5d3d2e; /* Icon color */
  margin-left: 10px;
}

/* Input border and background */
.search-bar ::v-deep(.el-input__wrapper) {
  border-radius: 10px;
  border: 1px solid #d4c4b6; /* Optional: custom border */
  box-shadow: none;
  padding: 4px;
}

.home-button {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  transition: background 0.3s;
}

.logout-item {
  color: #ff2200af !important;
  font-weight: 600;
}

.logout-item:hover {
  background-color: transparent !important;
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
