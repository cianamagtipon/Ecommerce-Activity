<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, UserFilled } from '@element-plus/icons-vue'
import { BookOpenIcon } from '@heroicons/vue/24/solid'
import { useScreenSize } from '@/composables/screenSize'
import { useUserStore } from '@/pinia/user'
import { ElMessageBox } from 'element-plus'

import CartDropdown from '@/components/cart/CartDropdown.vue'

const emit = defineEmits(['logout-clicked', 'login-clicked'])

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.currentUser)

const fullscreenLoading = ref(false)

const route = useRoute()
const router = useRouter()

const activeIndex = ref('1')
const { isMobile } = useScreenSize()
const isDrawerVisible = ref(false)

const handleSelect = async (key: string) => {
  activeIndex.value = key

  if (key === '1-1') {
    router.push('/home')
  } else if (key === '1-2') {
    router.push('/store')
  } else if (key === '1-3') {
    router.push('/profile')
  } else if (key === 'orders') {
    router.push('/profile/orders')
  } else if (key === 'logout') {
    try {
      await ElMessageBox.confirm(
        'Are you sure you want to log out?',
        'Confirm Logout',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning',
        },
      )
      userStore.logout?.()
      router.push('/home')
    } catch (err) {
      console.log('Logout cancelled.')
    }
  } else if (key === 'login') {
    emit('login-clicked')
  } else if (key === 'signup') {
    router.push('/registration')
  }

  isDrawerVisible.value = false
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

        <div class="mobile-nav-item user-dropdown">
          <el-dropdown
            trigger="click"
            @command="handleSelect"
            class="dropdown-inner"
          >
            <span class="el-dropdown-link">
              <el-icon><UserFilled /></el-icon>
            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <template v-if="isLoggedIn">
                  <el-dropdown-item command="1-3">Profile</el-dropdown-item>
                  <el-dropdown-item command="orders">Orders</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <span class="logout-item">Logout</span>
                  </el-dropdown-item>
                </template>
                <template v-else>
                  <el-dropdown-item command="login">Login</el-dropdown-item>
                  <el-dropdown-item command="signup">Sign Up</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

.user-dropdown {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropdown-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  font-size: 1.2rem;
  color: #bba68b;
}

.el-dropdown-menu {
  min-width: 120px;
  text-align: left;
}

.logout-item {
  color: #ff2200af !important;
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
  color: #bba68b !important;
  opacity: 1 !important;
}

/* Input text color */
.search-bar ::v-deep(.el-input__inner) {
  color: #5d3d2e;
}

/* Search icon color */
.search-bar ::v-deep(.el-input__prefix .el-icon) {
  color: #5d3d2e;
  margin-left: 10px;
}

/* Input border and background */
.search-bar ::v-deep(.el-input__wrapper) {
  border-radius: 10px;
  border: 1px solid #d4c4b6;
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

/* Dropdown menu theme */
::v-deep(.el-dropdown-menu) {
  background-color: #fff8f3 !important;
  border: 1px solid #d4c4b6 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

/* Dropdown item text color and hover effect */
::v-deep(.el-dropdown-menu__item) {
  color: #5d3d2e !important;
  font-weight: 500;
  padding: 10px 16px;
  transition: background 0.2s;
}

::v-deep(.el-dropdown-menu__item--divided::before) {
  border-top: 1px solid #d4c4b6 !important;
}

.logout-item {
  color: #d9372c !important;
  font-weight: 600;
}
</style>
