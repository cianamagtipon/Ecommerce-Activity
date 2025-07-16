<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

// Props and emit for v-model
const props = defineProps<{ dialogVisible: boolean }>()
const emit = defineEmits<{
  (e: 'update:dialogVisible', value: boolean): void
}>()

// local state mirrors props
const dialogVisible = ref(props.dialogVisible)

watch(
  () => props.dialogVisible,
  (newVal) => {
    dialogVisible.value = newVal
  },
)

// form inputs
const username = ref('')
const password = ref('')
const loading = ref(false)

function closeDialog() {
  emit('update:dialogVisible', false)
}

async function handleLogin() {
  loading.value = true

  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (username.value === 'admin' && password.value === 'password') {
    ElMessage.success('Login successful!')
    emit('update:dialogVisible', false)
  } else {
    ElMessage.error('Invalid credentials')
  }

  loading.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Login"
    width="400px"
    append-to-body
    @update:model-value="emit('update:dialogVisible', $event)"
    @close="closeDialog"
  >
    <el-form label-width="80px">
      <el-form-item label="Username">
        <el-input v-model="username" autocomplete="off" />
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
      <el-button @click="dialogVisible = false" :disabled="loading"
        >Cancel</el-button
      >
      <el-button type="primary" @click="handleLogin" :loading="loading"
        >Login</el-button
      >
    </template>
  </el-dialog>
</template>
