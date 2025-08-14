<script setup lang="ts">
import router from '@/router'

import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/pinia/user'
import { Message, Lock } from '@element-plus/icons-vue'

import { useFormatter } from '@/composables/formatter'

const { formatEmail } = useFormatter()

// validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

// manual rules (overriding validation composable)
const emailRule = [
  { required: true, message: 'Email is required', trigger: 'manual' },
  {
    pattern: emailRegex,
    message: 'Email must be valid (e.g., user@example.com)',
  },
]

const passwordRule = [
  { required: true, message: 'Password is required', trigger: 'manual' },
  {
    pattern: passwordRegex,
    message: 'Password must be at least 8 characters and include a number',
  },
]

const userStore = useUserStore()

const props = defineProps<{ dialogVisible: boolean }>()
const emit = defineEmits<{
  (e: 'update:dialogVisible', value: boolean): void
  (e: 'login-success'): void
  (e: 'open-register'): void
}>()

const dialogVisible = ref(props.dialogVisible)

watch(
  () => props.dialogVisible,
  (newVal) => {
    dialogVisible.value = newVal
  },
)

// form model for Element Plus
const formModel = ref({ email: '', password: '' })
const emailInput = ref('')
const passwordInput = ref('')

// dirty flags to track user typing
const emailDirty = ref(false)
const passwordDirty = ref(false)

// mark email as dirty
function markEmailDirty() {
  emailDirty.value = true
}

// mark password as dirty
function markPasswordDirty() {
  passwordDirty.value = true
}

function onEmailBlur() {
  emailInput.value = formatEmail(emailInput.value)
}

const loading = ref(false)
const loginFormRef = ref<FormInstance | null>(null)
const passwordInputKey = ref(0)

function closeDialog() {
  emit('update:dialogVisible', false)
  emailInput.value = ''
  passwordInput.value = ''
  emailDirty.value = false
  passwordDirty.value = false
  loginFormRef.value?.resetFields()
  passwordInputKey.value++ // remount password input to reset show-password
}

async function handleLogin() {
  if (!loginFormRef.value) return

  // mark fields dirty
  emailDirty.value = true
  passwordDirty.value = true

  // clean / format inputs
  emailInput.value = formatEmail(emailInput.value)

  // copy to form model
  formModel.value.email = emailInput.value
  formModel.value.password = passwordInput.value

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = userStore.login(emailInput.value, passwordInput.value)

    if (success) {
      ElMessage.success('Login successful!')
      emit('login-success')
      closeDialog()
      window.location.reload()
    } else {
      ElMessage.error('Invalid email or password')
    }

    loading.value = false
  })
}

function goToRegister() {
  closeDialog()
  router.push('/registration')
}

// responsive dialog width
const dialogWidth = ref(getDialogWidth())

function getDialogWidth() {
  return window.innerWidth < 600 ? '90vw' : '450px'
}

function handleResize() {
  dialogWidth.value = getDialogWidth()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :width="dialogWidth"
    append-to-body
    class="login-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="!loading"
    :show-close="false"
    @update:model-value="emit('update:dialogVisible', $event)"
    @close="closeDialog"
  >
    <div class="login-content">
      <h2 class="dialog-title">Log In</h2>
      <p class="login-note">
        Log in to save your cart, buy your favorites, and enjoy a personalized
        experience.
      </p>

      <el-form
        v-if="dialogVisible"
        ref="loginFormRef"
        :model="formModel"
        :rules="{ email: emailRule, password: passwordRule }"
        label-position="top"
        class="login-form"
      >
        <el-form-item prop="email">
          <el-input
            v-model="emailInput"
            autocomplete="off"
            size="large"
            placeholder="Email"
            clearable
            @input="markEmailDirty"
            @blur="onEmailBlur"
            @keydown.enter.prevent="handleLogin"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            :key="passwordInputKey"
            v-model="passwordInput"
            type="password"
            class="password"
            autocomplete="off"
            size="large"
            placeholder="Password"
            clearable
            show-password
            @input="markPasswordDirty"
            @keydown.enter.prevent="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <div class="signup-prompt">
        <span>Don’t have an account yet?</span>
        <a @click="goToRegister">Sign up here</a>
      </div>
    </div>

    <template #footer>
      <div class="footer-buttons">
        <el-button class="cancel-btn" @click="closeDialog" :disabled="loading">
          Cancel
        </el-button>
        <el-button
          type="primary"
          class="login-btn"
          @click="handleLogin"
          :loading="loading"
        >
          Login
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.login-dialog {
  border-radius: 20px;
  max-width: 100vw;
}

.login-content {
  padding: 1rem 3rem;
}

.dialog-title {
  font-size: 24px;
  font-weight: 600;
  color: #5b4636;
  margin-bottom: 2rem;
  text-align: center;
}

.login-note {
  margin-top: -1rem;
  margin-bottom: 2.5rem;
  font-size: 14px;
  color: #6c584c;
  text-align: center;
  line-height: 1.4;
}

.password {
  margin-top: 5px;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.login-btn {
  background-color: #7f5539;
  border-color: #7f5539;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.login-btn:hover {
  background-color: #9c6644;
  border-color: #9c6644;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid #7f5539;
  color: #7f5539;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #fef6f0;
  border-color: #9c6644;
  color: #9c6644;
}

.el-form-item__label {
  color: #4a3728;
  font-weight: 500;
}

.login-form-no-labels .el-form-item {
  margin-top: 1.5rem;
}

.signup-prompt {
  margin-top: 2.5rem;
  margin-bottom: 15px;
  text-align: center;
  font-size: 13px;
  color: #6c584c;
}

.signup-prompt a {
  margin-left: 6px;
  color: #7f5539;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.signup-prompt a:hover {
  color: #9c6644;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .login-content {
    padding: 1rem 1.5rem;
  }

  .dialog-title {
    font-size: 20px;
  }

  .login-note {
    font-size: 13px;
  }

  .signup-prompt {
    font-size: 12px;
  }

  .footer-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    flex-wrap: nowrap;
  }

  .login-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
