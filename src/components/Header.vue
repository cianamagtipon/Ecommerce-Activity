<script setup lang="ts">
import { useUserStore } from '@/pinia/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { SwitchButton } from '@element-plus/icons-vue'

const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)
const router = useRouter()

const emit = defineEmits(['login-clicked', 'logout-clicked'])

// Sign up button now directly routes
function goToRegister() {
  router.push('/registration')
}
</script>

<template>
  <div class="header-container">
    <div class="top-header">
      <span class="logo">BOOKTALK</span>

      <div class="right">
        <div class="auth-buttons">
          <el-button
            v-if="!isLoggedIn"
            class="login-button"
            round
            @click="emit('login-clicked')"
          >
            Log in
          </el-button>

          <el-button
            v-if="!isLoggedIn"
            class="signup-button"
            round
            @click="goToRegister"
          >
            Sign up for free
          </el-button>

          <el-button
            v-else
            :icon="SwitchButton"
            class="logout-button"
            round
            @click="emit('logout-clicked')"
          >
            Log out
          </el-button>
        </div>
      </div>
    </div>

    <el-divider class="tagline" content-position="left">
      <em>Where Stories Spark Conversations</em>
    </el-divider>
  </div>
</template>

<style scoped>
.header-container {
  margin-bottom: 0.25rem;
}

.top-header {
  /* border-bottom: 0.2px solid #ddd; */
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 30px;
  font-weight: 600;
  margin-top: 5px;
  color: #5d3d2e;
}

.right a {
  margin-left: 1rem;
  color: #666;
  text-decoration: none;
}

.right a:hover {
  text-decoration: underline;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

.signup-button {
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

.signup-button:hover {
  background-color: #bba68b;
  color: #3b2a22;
  transform: scale(1.03);
}

.login-button {
  border: 1px solid #5d3d2e;
  color: #5d3d2e;
  background-color: transparent;
  font-weight: 600;
  padding: 10px 20px;
  font-size: 14px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.login-button:hover {
  border: 1px solid #5d3d2e;
  background-color: #f3ebe3;
  color: #3b2a22;
  transform: scale(1.03);
}

.logout-button {
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

.logout-button:hover {
  background-color: #bba68b;
  color: #3b2a22;
  transform: scale(1.03);
}

.tagline {
  color: #5d3d2e;
}

::v-deep(.el-divider) {
  border-top: 1px solid rgba(93, 61, 46, 0.3);
  margin-top: 0.25rem;
  margin-bottom: 1rem;
}

::v-deep(.el-divider__text) {
  color: #5d3d2e;
  background-color: white;
  padding: 0 8px;
}

@media (max-width: 600px) {
  .right {
    display: none;
  }
}
</style>
