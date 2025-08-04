<script setup lang="ts">
import { useScreenSize } from '@/composables/screenSize'
import ProfileSidebar from './profile/ProfileSidebar.vue'

const { isMobile } = useScreenSize()
</script>

<template>
  <div class="profile-layout">
    <ProfileSidebar v-if="!isMobile" />

    <div class="profile-main">
      <transition name="fade-slide" mode="out-in" appear>
        <router-view />
      </transition>
    </div>
  </div>
</template>

<style scoped>
.profile-layout {
  display: flex;
}

.profile-main {
  flex: 1;
  padding: 1rem;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
