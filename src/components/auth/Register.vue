<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/user'

const userStore = useUserStore()

const props = defineProps<{ dialogVisible: boolean }>()
const emit = defineEmits<{
  (e: 'update:dialogVisible', value: boolean): void
}>()

const localVisible = ref(props.dialogVisible)

watch(
  () => props.dialogVisible,
  (newVal) => {
    localVisible.value = newVal
  },
)

watch(
  () => localVisible.value,
  (newVal) => {
    emit('update:dialogVisible', newVal)
  },
)

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
})

const loading = ref(false)

watch(localVisible, (newVal) => {
  if (!newVal) {
    form.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
    }
  }
})

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    ElMessage.error('Passwords do not match')
    return
  }

  loading.value = true
  try {
    const success = userStore.register({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      phone: form.value.phone.trim(),
      address: form.value.address.trim(),
      userOrders: [],
    })

    if (!success) {
      ElMessage.error('Account already exists.')
      return
    }

    ElMessage.success('Registration successful!')
    localVisible.value = false
  } catch (e) {
    ElMessage.error(
      'Registration failed: ' +
        (e instanceof Error ? e.message : 'Unknown error'),
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog v-model="localVisible" width="500px">
    <el-form label-position="top" :model="form">
      <el-form-item label="Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item label="Confirm Password">
        <el-input v-model="form.confirmPassword" type="password" />
      </el-form-item>
      <el-form-item label="Phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="Address">
        <el-input type="textarea" v-model="form.address" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="localVisible = false">Cancel</el-button>
      <el-button type="primary" :loading="loading" @click="handleRegister">
        Register
      </el-button>
    </template>
  </el-dialog>
</template>
