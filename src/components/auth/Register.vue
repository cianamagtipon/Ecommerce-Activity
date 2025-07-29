<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/user'
import { luzonLocations } from '@/assets/data/luzonLocations'

const userStore = useUserStore()

const provinces = Object.keys(luzonLocations)
const cities = ref<string[]>([])
const addressOpen = ref<string[]>([])

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
  address: {
    province: '',
    city: '',
    street: '',
    house: '',
    postalCode: '',
  },
})

const loading = ref(false)

// Update cities when province changes
watch(
  () => form.value.address.province,
  (newProvince) => {
    cities.value = luzonLocations[newProvince] || []
    form.value.address.city = ''
  },
)

watch(
  () => form.value.address.province,
  (newProvince) => {
    cities.value = luzonLocations[newProvince] || []
    form.value.address.city = '' // clear previous city
  },
  { immediate: true },
)

// Reset form on close
watch(localVisible, (newVal) => {
  if (!newVal) {
    form.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: {
        province: '',
        city: '',
        street: '',
        house: '',
        postalCode: '',
      },
    }
    cities.value = []
  }
})

function getFullAddress() {
  const a = form.value.address
  return [a.province, a.city, a.street, a.house, a.postalCode]
    .filter(Boolean)
    .join(', ')
}

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
      address: getFullAddress(),
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

onMounted(() => {
  const a = form.value.address
  if (a.province || a.city || a.street || a.house || a.postalCode) {
    addressOpen.value = ['address']
  }
})
</script>

<template>
  <el-dialog
    v-model="localVisible"
    width="800px"
    title="Register"
    class="register-dialog"
  >
    <el-form label-position="top" :model="form">
      <el-row :gutter="20">
        <!-- Account Credentials -->
        <el-col :span="12">
          <el-form-item label="Email" label-width="100%">
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item label="Password" label-width="100%">
            <el-input v-model="form.password" type="password" show-password />
          </el-form-item>
          <el-form-item label="Confirm Password" label-width="100%">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              show-password
            />
          </el-form-item>
        </el-col>

        <!-- Personal Info + Address -->
        <el-col :span="12">
          <h3 class="form-section-title">
            Personal Information & Address
            <span class="form-note"
              >(Optional, can be updated in your profile)</span
            >
          </h3>

          <el-form-item label="Name" label-width="100%">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="Phone" label-width="100%">
            <el-input v-model="form.phone" />
          </el-form-item>

          <el-collapse v-model="addressOpen" class="address-collapse">
            <el-collapse-item name="address">
              <template #title>
                <span class="collapse-title">Add Address Information</span>
              </template>

              <el-form-item label="Province" label-width="100%">
                <el-select
                  v-model="form.address.province"
                  placeholder="Select province"
                  class="w-full"
                >
                  <el-option
                    v-for="prov in provinces"
                    :key="prov"
                    :label="prov"
                    :value="prov"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="City / Municipality" label-width="100%">
                <el-select
                  v-model="form.address.city"
                  :disabled="!cities.length"
                  placeholder="Select city"
                  class="w-full"
                >
                  <el-option
                    v-for="city in cities"
                    :key="city"
                    :label="city"
                    :value="city"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="Street" label-width="100%">
                <el-input v-model="form.address.street" />
              </el-form-item>

              <el-form-item label="House / Unit" label-width="100%">
                <el-input v-model="form.address.house" />
              </el-form-item>

              <el-form-item label="Postal Code" label-width="100%">
                <el-input v-model="form.address.postalCode" maxlength="4" />
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="localVisible = false">Cancel</el-button>
      <el-button type="primary" :loading="loading" @click="handleRegister">
        Register
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.register-dialog {
  --el-dialog-padding-primary: 24px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.form-note {
  font-size: 12px;
  font-weight: 400;
  color: #888;
  margin-left: 8px;
}

.address-collapse .el-collapse-item__header {
  font-weight: 500;
  font-size: 14px;
}

.w-full {
  width: 100%;
}
</style>
