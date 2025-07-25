<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/user'

const userStore = useUserStore()

const props = defineProps<{ dialogVisible: boolean }>()
const emit = defineEmits<{
  (e: 'update:dialogVisible', value: boolean): void
  (e: 'login-success'): void // ✅ Add this
}>()

const dialogVisible = ref(props.dialogVisible)

watch(
  () => props.dialogVisible,
  (newVal) => {
    dialogVisible.value = newVal
  },
)

const email = ref('')
const password = ref('')
const loading = ref(false)

function closeDialog() {
  emit('update:dialogVisible', false)
  email.value = ''
  password.value = ''
}

async function handleLogin() {
  loading.value = true

  await new Promise((resolve) => setTimeout(resolve, 500)) // simulate delay

  const success = userStore.login(email.value, password.value)

  if (success) {
    ElMessage.success('Login successful!')
    emit('login-success')
    emit('update:dialogVisible', false)
    email.value = ''
    password.value = ''
  } else {
    ElMessage.error('Invalid email or password')
  }

  loading.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="400px"
    append-to-body
    @update:model-value="emit('update:dialogVisible', $event)"
    @close="closeDialog"
  >
    <el-form label-width="80px">
      <el-form-item label="Email">
        <el-input v-model="email" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Password">
        <el-input
          v-model="password"
          show-password
          type="password"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false" :disabled="loading">
        Cancel
      </el-button>
      <el-button type="primary" @click="handleLogin" :loading="loading">
        Login
      </el-button>
    </template>
  </el-dialog>
</template>
