<script setup lang="ts">
import { useUserStore } from '@/pinia/user'
import {
  User,
  List,
  ChatDotRound,
  Star,
  Lock,
  Setting,
} from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
</script>

<template>
  <aside class="profile-sidebar">
    <div>
      <h3 class="sidebar-title">My Account</h3>
      <nav class="nav-links">
        <router-link
          to="/profile/user"
          class="nav-item"
          :class="{ active: route.path === '/profile/user' }"
        >
          <el-icon><User /></el-icon>
          <span>Profile Overview</span>
        </router-link>
        <router-link
          to="/profile/orders"
          class="nav-item"
          :class="{ active: route.path === '/profile/orders' }"
        >
          <el-icon><List /></el-icon>
          <span>Orders</span>
        </router-link>
        <!-- Future feature -->
        <!-- <div class="nav-item">
          <el-icon><Star /></el-icon>
          <span>Saved Items</span>
        </div> -->
      </nav>
    </div>

    <div class="sidebar-footer">
      <el-button
        class="feedback-button"
        type="danger"
        :icon="ChatDotRound"
        size="large"
        round
      >
        Give Feedback
      </el-button>
    </div>
  </aside>
</template>

<style scoped>
.profile-sidebar {
  width: 240px;
  padding: 1.5rem 1rem;
  background-color: rgba(187, 166, 139, 0.1);
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 500px;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #5d3d2e;
  margin-bottom: 1rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: #5d3d2e;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
}

.nav-item:hover {
  background-color: #eee4db;
}

.nav-item.active {
  background-color: #d8c1a8;
  font-weight: 600;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
}

.feedback-button {
  background-color: #5d3d2e;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 10px 20px;
  font-size: 14px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.feedback-button:hover {
  background-color: #bba68b;
  color: #3b2a22;
  transform: scale(1.03);
}
</style>
