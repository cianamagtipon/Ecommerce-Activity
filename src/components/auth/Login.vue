<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserListStore } from '@/pinia/userlist'
import { useUserStore } from '@/pinia/user'

const userListStore = useUserListStore()
const userStore = useUserStore()

const props = defineProps<{ dialogVisible: boolean }>()
const emit = defineEmits<{
  (e: 'update:dialogVisible', value: boolean): void
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

  // Call login on userlist store
  const success = userListStore.login(email.value, password.value)

  if (success) {
    // Sync user store state to current logged in user
    userStore.syncWithUserList()

    ElMessage.success('Login successful!')
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
