<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/user'
import { useValidationRules } from '@/composables/validationRules'
import { useFormatter } from '@/composables/formatter'
import { useLocationSearch } from '@/composables/locationSearch'
import {
  User,
  Message,
  Iphone,
  Location,
  Edit,
  Check,
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const { required, emailRule, phoneRule, postalCodeRule } = useValidationRules()
const { cleanSpaces, removeAllSpaces, formatPhone, formatEmail } =
  useFormatter()
const {
  findCityByZipPrefix,
  getCitiesByProvince,
  getAllProvinces,
  getPostalCodeSuggestions,
} = useLocationSearch()

const provinces = getAllProvinces()
const cities = ref<string[]>([])

const isEditingName = ref(false)
const isEditingEmail = ref(false)
const isEditingPhone = ref(false)
const isEditingAddress = ref(false)

const loading = ref(false)
const isAutofillingFromZip = ref(false)

const editableForm = ref({
  name: userStore.name,
  email: userStore.email,
  phone: userStore.phone,
  address: {
    province: userStore.currentUser?.address?.province ?? '',
    city: userStore.currentUser?.address?.city ?? '',
    home: userStore.currentUser?.address?.home ?? '',
    zip: userStore.currentUser?.address?.zip ?? '',
  },
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

watch(
  [
    () => editableForm.value.address.province,
    () => editableForm.value.address.city,
  ],
  ([newProvince, newCity]) => {
    if (!newProvince && !newCity && editableForm.value.address.zip) {
      editableForm.value.address.zip = ''
    }
  },
)

function blurFormatField(fieldPath: string) {
  const segments = fieldPath.split('.')
  let target: any = editableForm.value
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
  loading.value = true
  try {
    let updateData: Record<string, any> = {}

    if (field === 'address') {
      updateData.address = { ...editableForm.value.address }
    } else {
      updateData[field] = cleanSpaces(editableForm.value[field])
      if (field === 'email') updateData.email = formatEmail(updateData.email)
      if (field === 'phone') updateData.phone = formatPhone(updateData.phone)
    }

    await userStore.updateUserData(updateData)

    if (field === 'address') {
      Object.assign(editableForm.value.address, {
        ...userStore.currentUser?.address,
      })
    }

    ElMessage.success(
      `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`,
    )
  } catch (e) {
    ElMessage.error(
      'Update failed: ' + (e instanceof Error ? e.message : 'Unknown error'),
    )
  } finally {
    loading.value = false
  }
}

function toggleEdit(field: 'name' | 'email' | 'phone' | 'address') {
  switch (field) {
    case 'name':
      if (isEditingName.value) saveField('name')
      isEditingName.value = !isEditingName.value
      break
    case 'email':
      if (isEditingEmail.value) saveField('email')
      isEditingEmail.value = !isEditingEmail.value
      break
    case 'phone':
      if (isEditingPhone.value) saveField('phone')
      isEditingPhone.value = !isEditingPhone.value
      break
    case 'address':
      if (isEditingAddress.value) saveField('address')
      isEditingAddress.value = !isEditingAddress.value
      break
  }
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-section">
      <h2>User Profile</h2>

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
          {{ editableForm.name || 'N/A' }}
        </div>
        <el-input
          v-else
          v-model="editableForm.name"
          @blur="blurFormatField('name')"
          placeholder="Enter your name"
        />
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
          {{ editableForm.email || 'N/A' }}
        </div>
        <el-input
          v-else
          v-model="editableForm.email"
          @blur="blurFormatField('email')"
          placeholder="Enter your email"
        />
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
          {{ editableForm.phone || 'N/A' }}
        </div>
        <el-input
          v-else
          v-model="editableForm.phone"
          placeholder="Enter phone number"
          @blur="blurFormatField('phone')"
          class="full-width-phone"
        >
          <template #prepend>+63</template>
        </el-input>
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
            class="address-zip"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 16px 20px;
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
