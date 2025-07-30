<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/user'
import { useValidationRules } from '@/composables/validationRules'
import { useFormatter } from '@/composables/formatter'
import { useLocationSearch } from '@/composables/locationSearch'

const router = useRouter()
const userStore = useUserStore()
const {
  required,
  nameRule,
  emailRule,
  passwordRule,
  phoneRule,
  postalCodeRule,
  passwordMatch,
} = useValidationRules()

const { cleanSpaces, removeAllSpaces, formatPhone, formatEmail, formatForm } =
  useFormatter()

const {
  findCityByZipPrefix,
  getCitiesByProvince,
  getAllProvinces,
  getPostalCodeSuggestions,
} = useLocationSearch()

const provinces = getAllProvinces()
const cities = ref<string[]>([])
const activeCollapseNames = ref<string[]>([])

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: {
    province: '',
    city: '',
    home: '',
    postalCode: '',
  },
})

const formRef = ref()
const loading = ref(false)
const isAutofillingFromZip = ref(false)

const rules = {
  name: [
    required,
    ...nameRule,
    {
      validator: (
        _rule: any,
        value: string,
        callback: (err?: Error) => void,
      ) => {
        if (!value) return callback()
      },
      trigger: 'blur',
    },
  ],
  email: [required, ...emailRule],
  password: [required, ...passwordRule],
  confirmPassword: [required, passwordMatch(() => form.value.password)],
  phone: [...phoneRule],
  'address.province': [],
  'address.city': [],
  'address.home': [],
  'address.postalCode': postalCodeRule(
    () => form.value.address.province,
    () => form.value.address.city,
  ),
}

// watch ZIP to auto-fill province/city
watch(
  () => form.value.address.postalCode,
  (zip) => {
    const cleanedZip = removeAllSpaces(zip)
    const match = findCityByZipPrefix(cleanedZip)
    if (match) {
      isAutofillingFromZip.value = true
      form.value.address.province = match.province
      cities.value = getCitiesByProvince(match.province)
      form.value.address.city = match.city
      setTimeout(() => {
        isAutofillingFromZip.value = false
      }, 0)
    }
  },
)

// watch province to load cities
watch(
  () => form.value.address.province,
  (newProvince) => {
    cities.value = getCitiesByProvince(newProvince)
    if (!isAutofillingFromZip.value) {
      form.value.address.city = ''
    }
  },
  { immediate: true },
)

// clear zip if province/city are cleared
watch(
  [() => form.value.address.province, () => form.value.address.city],
  ([newProvince, newCity]) => {
    if (!newProvince && !newCity && form.value.address.postalCode) {
      form.value.address.postalCode = ''
    }
  },
)

const queryPostalSuggestions = (queryString: string, cb: Function) => {
  const province = form.value.address.province
  const city = form.value.address.city
  const results = getPostalCodeSuggestions(queryString, { province, city })
  cb(results)
}

function handleZipSelect(item: { value: string }) {
  const location = findCityByZipPrefix(item.value)
  if (location) {
    isAutofillingFromZip.value = true
    form.value.address.province = location.province
    cities.value = getCitiesByProvince(location.province)
    form.value.address.city = location.city
    setTimeout(() => {
      isAutofillingFromZip.value = false
    }, 0)
  }
}

function blurFormatField(fieldPath: string) {
  const segments = fieldPath.split('.')
  let target: any = form.value
  for (let i = 0; i < segments.length - 1; i++) {
    target = target[segments[i]]
  }
  const key = segments[segments.length - 1]
  if (typeof target[key] === 'string') {
    let val = target[key]
    switch (key) {
      case 'email':
        val = formatEmail(val)
        break
      case 'phone':
        val = formatPhone(val)
        break
      case 'postalCode':
        val = removeAllSpaces(val)
        break
      default:
        val = cleanSpaces(val)
    }
    target[key] = val
  }
}

function getFullAddress() {
  const a = form.value.address
  return [a.province, a.city, a.home, a.postalCode].filter(Boolean).join(', ')
}

async function handleRegister() {
  console.log('[handleRegister] clicked')

  const success = userStore.register({
    name: form.value.name,
    email: form.value.email,
    password: form.value.password,
    phone: form.value.phone,
    address: {
      province: form.value.address.province,
      city: form.value.address.city,
      zip: form.value.address.postalCode,
      home: form.value.address.home,
    },
    userOrders: [],
  })

  console.log('[handleRegister] success?', success)

  if (!success) {
    ElMessage.error('Account already exists.')
    return
  }

  ElMessage.success('Registration successful!')
  router.push('/home')
}
</script>

<template>
  <div class="register-view">
    <el-card class="register-card">
      <h1 class="page-title">Create an Account</h1>

      <el-form
        label-position="top"
        :model="form"
        :rules="rules"
        ref="formRef"
        class="register-form"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" @blur="blurFormatField('name')" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" @blur="blurFormatField('email')" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>

        <el-divider content-position="center" class="divider">
          <el-icon><i-ep-user /></el-icon>
          <span class="divider-title">Additional Details</span>
        </el-divider>

        <p class="info-note">
          These details help personalize your experience but can be updated
          later in your profile.
        </p>

        <el-collapse v-model="activeCollapseNames">
          <el-collapse-item title="Contact & Address" name="contact">
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="form.phone" @blur="blurFormatField('phone')" />
            </el-form-item>

            <el-form-item label="Province" prop="address.province">
              <el-select
                v-model="form.address.province"
                placeholder="Select province"
                class="w-full"
                clearable
              >
                <el-option
                  v-for="prov in provinces"
                  :key="prov"
                  :label="prov"
                  :value="prov"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="cities.length"
              label="City / Municipality"
              prop="address.city"
            >
              <el-select
                v-model="form.address.city"
                placeholder="Select city"
                class="w-full"
                :disabled="!cities.length"
                clearable
              >
                <el-option
                  v-for="city in cities"
                  :key="city"
                  :label="city"
                  :value="city"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="Postal Code" prop="address.postalCode">
              <el-autocomplete
                v-model="form.address.postalCode"
                :fetch-suggestions="queryPostalSuggestions"
                placeholder="Enter ZIP code"
                maxlength="4"
                :trigger-on-focus="true"
                value-key="value"
                @select="handleZipSelect"
                @blur="blurFormatField('address.postalCode')"
                class="w-full"
              />
            </el-form-item>

            <el-form-item label="House / Unit" prop="address.home">
              <el-input
                v-model="form.address.home"
                placeholder="Enter house or unit number"
                @blur="blurFormatField('address.home')"
              />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <div class="form-footer">
          <el-button
            type="primary"
            class="register-btn"
            :loading="loading"
            @click="handleRegister"
          >
            Register
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.register-view {
  max-width: 500px;
  margin: 0 auto;
  padding: 16px 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  color: #5b4636;
  margin-top: 0;
  margin-bottom: 2rem;
}

.register-card {
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee6dc;
}

.el-form-item__label {
  color: #4a3728;
  font-weight: 500;
}

.el-input__inner,
.el-select__input {
  background-color: #fffaf5;
}

.form-footer {
  margin-top: 24px;
  text-align: right;
}

.divider {
  margin-top: 3.5rem;
  margin-bottom: 1rem;
}

.divider-title {
  font-size: 16px;
  font-weight: 500;
  color: #5b4636;
}

.info-note {
  font-size: 13px;
  color: #6c584c;
  opacity: 90%;
  margin: 2rem;
  text-align: center;
  font-style: italic;
}

.register-btn {
  background-color: #7f5539;
  border-color: #7f5539;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.register-btn:hover {
  background-color: #9c6644;
  border-color: #9c6644;
}
</style>
