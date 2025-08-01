<script setup lang="ts">
import { ref, watch, onMounted, type Ref } from 'vue'
import { ElMessage, type FormItemRule } from 'element-plus'
import { useUserStore } from '@/pinia/user'
import { useValidationRules } from '@/composables/validationRules'
import { useFormatter } from '@/composables/formatter'
import { useLocationSearch } from '@/composables/locationSearch'
import {
  User,
  Message,
  Lock,
  Iphone,
  Location,
  Edit,
  Check,
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const {
  required,
  nameRule,
  emailRule,
  passwordRule,
  phoneRule,
  postalCodeRule,
  passwordMatch,
  validateSingleField,
} = useValidationRules()

const { cleanSpaces, removeAllSpaces, formatPhone, formatEmail } =
  useFormatter()

const { findCityByZipPrefix, getCitiesByProvince, getAllProvinces } =
  useLocationSearch()

const provinces = getAllProvinces()
const cities = ref<string[]>([])

const isEditingName = ref(false)
const isEditingEmail = ref(false)
const isEditingPhone = ref(false)
const isEditingAddress = ref(false)
const isEditingPassword = ref(false)
const loading = ref(false)
const isAutofillingFromZip = ref(false)

const editablePassword = ref({
  password: '',
  confirmPassword: '',
})

const formRules: Record<string, FormItemRule[] | undefined> = {
  name: [required, ...nameRule],
  email: [required, ...emailRule],
  password: [required, ...passwordRule],
  confirmPassword: [
    required,
    passwordMatch(() => editablePassword.value.password),
  ],
  phone: [...phoneRule],
  'address.zip': postalCodeRule(
    () => editableForm.value.address.province,
    () => editableForm.value.address.city,
  ),
  'address.city': [],
  'address.province': [],
  'address.home': [],
}

const fieldValidity = ref<Record<string, boolean>>({
  name: true,
  email: true,
  password: true,
  phone: true,
  address: true,
})

const editableForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: {
    province: '',
    city: '',
    home: '',
    zip: '',
  },
})

onMounted(() => {
  userStore.loadUserFromStorage()
  const u = userStore.currentUser
  if (u) {
    editableForm.value = {
      name: u.name ?? '',
      email: u.email ?? '',
      phone: u.phone ?? '',
      password: u.password ?? '',
      confirmPassword: '',
      address: {
        province: u.address?.province ?? '',
        city: u.address?.city ?? '',
        home: u.address?.home ?? '',
        zip: u.address?.zip ?? '',
      },
    }
    cities.value = getCitiesByProvince(editableForm.value.address.province)
  }
})

watch(
  () => editableForm.value.address.province,
  (newProvince, oldProvince) => {
    cities.value = getCitiesByProvince(newProvince)
    if (!isAutofillingFromZip.value && newProvince !== oldProvince) {
      editableForm.value.address.city = ''
    }
  },
  { immediate: true },
)

watch(
  () => editableForm.value.address.zip,
  (zip) => {
    const cleanedZip = removeAllSpaces(zip)
    const match = findCityByZipPrefix(cleanedZip)
    if (match) {
      isAutofillingFromZip.value = true
      editableForm.value.address.province = match.province
      cities.value = getCitiesByProvince(match.province)
      editableForm.value.address.city = match.city
      setTimeout(() => {
        isAutofillingFromZip.value = false
      }, 0)
    }
  },
)

function blurFormatField(fieldPath: string) {
  const segments = fieldPath.split('.')
  let target: any = editableForm.value
  for (let i = 0; i < segments.length - 1; i++) {
    target = target[segments[i]]
  }

  const key = segments[segments.length - 1]!

  if (typeof target[key] === 'string') {
    let val = target[key]
    switch (key) {
      case 'email':
        val = formatEmail(val)
        break
      case 'phone':
        val = formatPhone(val)
        break
      case 'zip':
        val = removeAllSpaces(val)
        break
      default:
        val = cleanSpaces(val)
    }
    target[key] = val
  }
}

function getFullAddress() {
  const a = editableForm.value.address
  return [a.province, a.city, a.home, a.zip].filter(Boolean).join(', ')
}

async function saveField(field: 'name' | 'email' | 'phone' | 'address') {
  const current = userStore.currentUser
  if (!current) return

  const clean = (val: string | undefined) => cleanSpaces(val || '')

  let currentValue, newValue

  if (field === 'address') {
    currentValue = JSON.stringify({
      home: clean(current.address?.home),
      city: clean(current.address?.city),
      province: clean(current.address?.province),
      zip: removeAllSpaces(current.address?.zip ?? ''),
    })

    newValue = JSON.stringify({
      home: clean(editableForm.value.address.home),
      city: clean(editableForm.value.address.city),
      province: clean(editableForm.value.address.province),
      zip: removeAllSpaces(editableForm.value.address.zip),
    })

    if (currentValue === newValue) return
  } else {
    const editedVal = clean(editableForm.value[field])
    const existingVal = clean(current[field])

    newValue =
      field === 'email'
        ? formatEmail(editedVal)
        : field === 'phone'
          ? formatPhone(editedVal)
          : editedVal

    currentValue =
      field === 'email'
        ? formatEmail(existingVal)
        : field === 'phone'
          ? formatPhone(existingVal)
          : existingVal

    if (currentValue === newValue) return

    if ((field === 'name' || field === 'email') && !newValue) {
      ElMessage.error(
        `${field[0].toUpperCase() + field.slice(1)} cannot be empty`,
      )
      return
    }
  }

  loading.value = true
  try {
    const updateData: any = {}

    if (field === 'address') {
      updateData.address = JSON.parse(newValue)
    } else {
      updateData[field] = newValue
    }

    await userStore.updateUserData(updateData)

    if (field === 'address') {
      Object.assign(editableForm.value.address, userStore.currentUser?.address)
    }

    ElMessage.success(
      `${field[0].toUpperCase() + field.slice(1)} updated successfully!`,
    )
  } catch (e) {
    ElMessage.error(
      `Update failed: ${e instanceof Error ? e.message : 'Unknown error'}`,
    )
    console.error('Update failed:', e)
  } finally {
    loading.value = false
  }
}

async function hasChanges(field: 'name' | 'email' | 'phone' | 'address') {
  const current = userStore.currentUser
  if (!current) return false

  const clean = (val: string | undefined) => cleanSpaces(val || '')

  if (field === 'address') {
    const currentAddress = JSON.stringify({
      home: clean(current.address?.home),
      city: clean(current.address?.city),
      province: clean(current.address?.province),
      zip: removeAllSpaces(current.address?.zip ?? ''),
    })

    const newAddress = JSON.stringify({
      home: clean(editableForm.value.address.home),
      city: clean(editableForm.value.address.city),
      province: clean(editableForm.value.address.province),
      zip: removeAllSpaces(editableForm.value.address.zip),
    })

    return currentAddress !== newAddress
  }

  const newValue =
    field === 'email'
      ? formatEmail(clean(editableForm.value[field]))
      : field === 'phone'
        ? formatPhone(clean(editableForm.value[field]))
        : clean(editableForm.value[field])

  const currentValue =
    field === 'email'
      ? formatEmail(clean(current[field]))
      : field === 'phone'
        ? formatPhone(clean(current[field]))
        : clean(current[field])

  return currentValue !== newValue
}

async function toggleEdit(field: 'name' | 'email' | 'phone' | 'address') {
  const validateAndSave = async (fieldName: string, flag: Ref<boolean>) => {
    if (!flag.value) {
      flag.value = true
      return
    }

    const changed = await hasChanges(fieldName as any)
    if (!changed) {
      flag.value = false
      return
    }

    const validateTarget = fieldName === 'address' ? 'address.zip' : fieldName

    const segments = validateTarget.split('.')
    let value: any = editableForm.value
    for (const key of segments) {
      value = value?.[key]
    }

    // reset if empty for non-address fields
    const isEmpty =
      fieldName !== 'address' &&
      fieldName !== 'phone' &&
      typeof value === 'string' &&
      value.trim() === ''

    if (isEmpty) {
      const original = userStore.currentUser
      ;(editableForm.value as any)[fieldName] =
        (original as any)?.[fieldName] || ''
      flag.value = false
      return
    }

    const rules = formRules[validateTarget] || []
    const errorMessage = await validateSingleField(value, rules)

    fieldValidity.value[fieldName] = !errorMessage

    if (errorMessage) {
      ElMessage.error(errorMessage)
      return
    }

    await saveField(fieldName as any)
    flag.value = false
  }

  switch (field) {
    case 'name':
      await validateAndSave('name', isEditingName)
      break
    case 'email':
      await validateAndSave('email', isEditingEmail)
      break
    case 'phone':
      await validateAndSave('phone', isEditingPhone)
      break
    case 'address':
      await validateAndSave('address', isEditingAddress)
      break
  }
}

async function togglePasswordEdit() {
  if (!isEditingPassword.value) {
    isEditingPassword.value = true
    return
  }

  const { password, confirmPassword } = editablePassword.value

  // If both fields are empty, skip validation and just close edit mode
  if (!password && !confirmPassword) {
    isEditingPassword.value = false
    editablePassword.value.password = ''
    editablePassword.value.confirmPassword = ''
    return
  }

  // Proceed with validation if any field is filled
  const passwordError = await validateSingleField(password, passwordRule)
  const confirmError = await validateSingleField(confirmPassword, [
    required,
    passwordMatch(() => password),
  ])

  if (passwordError) {
    ElMessage.error(passwordError)
    return
  }

  if (confirmError) {
    ElMessage.error(confirmError)
    return
  }

  loading.value = true
  try {
    await userStore.updateUserData({ password })
    ElMessage.success('Password updated successfully')

    editablePassword.value.password = ''
    editablePassword.value.confirmPassword = ''
    isEditingPassword.value = false
  } catch (e) {
    ElMessage.error('Failed to update password')
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-section">
      <h2>User Profile</h2>

      <!-- FORM START -->
      <el-form
        ref="formRef"
        :model="editableForm"
        :rules="formRules"
        label-position="top"
        status-icon
      >
        <!-- Name -->
        <div class="field-group">
          <label class="label-with-icon">
            <el-icon><User /></el-icon>
            Name
            <div class="edit-toggle" @click="toggleEdit('name')">
              <el-icon :style="{ color: isEditingName ? 'green' : '' }">
                <component :is="isEditingName ? Check : Edit" />
              </el-icon>
              <span :style="{ color: isEditingName ? 'green' : '#3b2a22' }">
                {{ isEditingName ? 'Save' : 'Edit' }}
              </span>
            </div>
          </label>

          <div v-if="!isEditingName" class="readonly-text">
            {{ editableForm.name }}
          </div>

          <el-form-item v-else prop="name">
            <el-input
              v-model="editableForm.name"
              @blur="blurFormatField('name')"
              placeholder="Enter your name"
            />
          </el-form-item>
        </div>

        <!-- Email -->
        <div class="field-group">
          <label class="label-with-icon">
            <el-icon><Message /></el-icon>
            Email
            <div class="edit-toggle" @click="toggleEdit('email')">
              <el-icon :style="{ color: isEditingEmail ? 'green' : '' }">
                <component :is="isEditingEmail ? Check : Edit" />
              </el-icon>
              <span :style="{ color: isEditingEmail ? 'green' : '#3b2a22' }">
                {{ isEditingEmail ? 'Save' : 'Edit' }}
              </span>
            </div>
          </label>
          <div v-if="!isEditingEmail" class="readonly-text">
            {{ editableForm.email }}
          </div>
          <el-form-item v-else prop="email">
            <el-input
              v-model="editableForm.email"
              @blur="blurFormatField('email')"
              placeholder="Enter your email"
            />
          </el-form-item>
        </div>

        <!-- Phone -->
        <div class="field-group">
          <label class="label-with-icon">
            <el-icon><Iphone /></el-icon>
            Phone
            <div class="edit-toggle" @click="toggleEdit('phone')">
              <el-icon :style="{ color: isEditingPhone ? 'green' : '' }">
                <component :is="isEditingPhone ? Check : Edit" />
              </el-icon>
              <span :style="{ color: isEditingPhone ? 'green' : '#3b2a22' }">
                {{ isEditingPhone ? 'Save' : 'Edit' }}
              </span>
            </div>
          </label>
          <div v-if="!isEditingPhone" class="readonly-text">
            {{ editableForm.phone ? '+63' + editableForm.phone : 'N/A' }}
          </div>

          <el-form-item v-else prop="phone">
            <el-input
              v-model="editableForm.phone"
              placeholder="Enter phone number"
              @blur="blurFormatField('phone')"
              class="full-width-phone"
            >
              <template #prepend>+63</template>
            </el-input>
          </el-form-item>
        </div>

        <!-- Address -->
        <div class="field-group">
          <label class="label-with-icon">
            <el-icon><Location /></el-icon>
            Address
            <div class="edit-toggle" @click="toggleEdit('address')">
              <el-icon :style="{ color: isEditingAddress ? 'green' : '' }">
                <component :is="isEditingAddress ? Check : Edit" />
              </el-icon>
              <span :style="{ color: isEditingAddress ? 'green' : '#3b2a22' }">
                {{ isEditingAddress ? 'Save' : 'Edit' }}
              </span>
            </div>
          </label>

          <div v-if="!isEditingAddress" class="readonly-text">
            {{ getFullAddress() || 'N/A' }}
          </div>

          <div v-else>
            <div class="address-select-group">
              <el-select
                v-model="editableForm.address.province"
                placeholder="Select province"
                clearable
                class="address-select"
              >
                <el-option
                  v-for="prov in provinces"
                  :key="prov"
                  :label="prov"
                  :value="prov"
                />
              </el-select>

              <el-select
                v-if="cities.length"
                v-model="editableForm.address.city"
                placeholder="Select city"
                clearable
                class="address-select"
              >
                <el-option
                  v-for="city in cities"
                  :key="city"
                  :label="city"
                  :value="city"
                />
              </el-select>
            </div>

            <el-input
              v-model="editableForm.address.home"
              placeholder="House / Unit"
              class="address-input"
            />

            <el-input
              v-model="editableForm.address.zip"
              placeholder="Postal Code"
              maxlength="4"
              @blur="blurFormatField('address.zip')"
              class="address-zip"
            />
          </div>
        </div>
      </el-form>
      <!-- FORM END -->

      <!-- Password (outside form) -->
      <div class="field-group">
        <label class="label-with-icon">
          <el-icon><Lock /></el-icon>
          Password
          <div class="edit-toggle" @click="togglePasswordEdit">
            <el-icon :style="{ color: isEditingPassword ? 'green' : '' }">
              <component :is="isEditingPassword ? Check : Edit" />
            </el-icon>
            <span :style="{ color: isEditingPassword ? 'green' : '#3b2a22' }">
              {{ isEditingPassword ? 'Save' : 'Change Password' }}
            </span>
          </div>
        </label>

        <div v-if="isEditingPassword">
          <el-input
            v-model="editablePassword.password"
            type="password"
            placeholder="New password"
            show-password
            class="mt-2 w-full"
          />
          <el-input
            v-model="editablePassword.confirmPassword"
            type="password"
            placeholder="Confirm password"
            show-password
            class="mt-2 w-full"
          />
        </div>

        <div v-else class="readonly-text">••••••••</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
}

.profile-section h2 {
  font-weight: 700;
  color: #3b2a22;
  margin-bottom: 1.5rem;
}

.field-group {
  margin-bottom: 2rem;
}

.label-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #3b2a22;
  margin-bottom: 0.5rem;
  user-select: none;
}

.is-disabled {
  pointer-events: none;
  opacity: 0.4;
}

.edit-toggle {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #3b2a22;
  user-select: none;
}

.edit-toggle:hover {
  opacity: 0.8;
}

.readonly-text {
  color: #bba68b;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;

  min-height: 2.5em;
  white-space: pre-wrap;
}

.full-width-phone ::v-deep(.el-input__wrapper) {
  width: 100%;
}

.mt-2 {
  margin-top: 0.5rem;
}

.w-full {
  width: 100%;
}

.address-select-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.address-input,
.address-zip {
  margin-top: 0.75rem;
  width: 100%;
}

.el-input__inner,
.el-select .el-input__inner {
  padding: 8px 12px;
  font-size: 14px;
}
</style>
