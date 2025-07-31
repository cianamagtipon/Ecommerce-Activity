<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, Edit } from '@element-plus/icons-vue'

import { useUserStore } from '@/pinia/user'
import { useCheckoutStore } from '@/pinia/checkout'
import { useCartStore } from '@/pinia/cart'
import { useOrderStore } from '@/pinia/orders'
import type { FormInstance } from 'element-plus'

import OrderSummary from './OrderSummary.vue'

import { useValidationRules } from '@/composables/validationRules'
import { useFormatter } from '@/composables/formatter'
import { useLocationSearch } from '@/composables/locationSearch'

const userStore = useUserStore()
const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const router = useRouter()

const { required, emailRule, phoneRule, postalCodeRule } = useValidationRules()
const { cleanSpaces, removeAllSpaces, formatPhone, formatEmail } =
  useFormatter()
const { findCityByZipPrefix, getCitiesByProvince, getAllProvinces } =
  useLocationSearch()

const provinces = getAllProvinces()
const cities = ref<string[]>([])
const isAutofillingFromZip = ref(false)

const isEditingPhone = ref(false)
const isEditingAddress = ref(false)
const loading = ref(false)

const formRef = ref<FormInstance>()

const editableForm = ref({
  name: '',
  email: '',
  phone: '',
  address: {
    province: '',
    city: '',
    home: '',
    zip: '',
  },
  notes: '',
})

watch(
  () => editableForm.value.address.province,
  (newProvince) => {
    cities.value = getCitiesByProvince(newProvince)
    if (!isAutofillingFromZip.value) {
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
  return [a.home, a.city, a.province, a.zip].filter(Boolean).join(', ')
}

async function saveField(field: 'phone' | 'address') {
  loading.value = true
  try {
    const updateData =
      field === 'phone'
        ? { phone: formatPhone(cleanSpaces(editableForm.value.phone)) }
        : {
            address: {
              province: cleanSpaces(editableForm.value.address.province),
              city: cleanSpaces(editableForm.value.address.city),
              home: cleanSpaces(editableForm.value.address.home),
              zip: removeAllSpaces(editableForm.value.address.zip),
            },
          }

    await userStore.updateUserData(updateData)
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

function toggleEdit(field: 'phone' | 'address') {
  if (field === 'phone') {
    if (isEditingPhone.value) saveField('phone')
    isEditingPhone.value = !isEditingPhone.value
  } else if (field === 'address') {
    if (isEditingAddress.value) saveField('address')
    isEditingAddress.value = !isEditingAddress.value
  }
}

const selectedItems = computed(() => checkoutStore.selectedItems)

async function placeOrder() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('Please log in to place your order.')
    window.openLoginModal?.()
    return
  }

  const { province, city, home, zip } = editableForm.value.address
  if (!province || !city || !home || !zip) {
    isEditingAddress.value = true
    ElMessage.error(
      'Please complete your shipping address before placing an order.',
    )
    return
  }

  const valid = await formRef.value?.validate()
  if (!valid) {
    ElMessage.error('Please correct the form errors before placing an order.')
    return
  }

  if (isEditingAddress.value || isEditingPhone.value) {
    ElMessage.error(
      'Please save your contact and address info before placing an order.',
    )
    return
  }

  try {
    loading.value = true

    await userStore.updateUserData({
      name: cleanSpaces(editableForm.value.name),
      email: formatEmail(editableForm.value.email),
      phone: formatPhone(cleanSpaces(editableForm.value.phone)),
      address: {
        province: cleanSpaces(editableForm.value.address.province),
        city: cleanSpaces(editableForm.value.address.city),
        home: cleanSpaces(editableForm.value.address.home),
        zip: removeAllSpaces(editableForm.value.address.zip),
      },
    })

    await orderStore.placeOrder(
      selectedItems.value,
      userStore.email,
      editableForm.value.notes,
    )

    cartStore.selectedISBNs.forEach((isbn) => cartStore.removeFromCart(isbn))
    cartStore.selectedISBNs.clear()
    cartStore.saveCartToStorage()
    cartStore.clearSelected()

    checkoutStore.clearSelectedItems()

    ElMessage.success('Order placed successfully!')
    router.push('/home')
  } catch (e) {
    ElMessage.error(
      'Order failed: ' + (e instanceof Error ? e.message : 'Unknown error'),
    )
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (checkoutStore.selectedItems.length === 0) {
    const savedOrder = localStorage.getItem('currentOrder')
    if (savedOrder) {
      const parsedItems = JSON.parse(savedOrder)
      checkoutStore.setSelectedItems(parsedItems)
    }
  }

  // rehydrate editableForm from userStore after data load
  editableForm.value = {
    name: userStore.name ?? '',
    email: userStore.email ?? '',
    phone: userStore.phone ?? '',
    address: {
      province: userStore.address?.province ?? '',
      city: userStore.address?.city ?? '',
      home: userStore.address?.home ?? '',
      zip: userStore.address?.zip ?? '',
    },
    notes: '',
  }

  // update city list if province exists
  if (userStore.address?.province) {
    cities.value = getCitiesByProvince(userStore.address.province)
  }
})

onBeforeRouteLeave(() => {
  checkoutStore.clearSelectedItems()
})
</script>

<template>
  <div class="checkout">
    <div class="checkout-form">
      <div class="checkout-header">
        <span class="title">Shipping Details</span>
      </div>

      <el-form
        ref="formRef"
        :model="editableForm"
        label-position="top"
        hide-required-asterisk
        :rules="{
          'address.province': [required],
          'address.city': [required],
          'address.home': [required],
          'address.zip': [required, postalCodeRule],
          phone: [phoneRule],
        }"
      >
        <div class="form-section">
          <h3>Personal Information</h3>

          <!-- Name (read-only) -->
          <div class="field-group">
            <div class="field-header">
              <label class="label">
                <span>Name</span>
              </label>
              <!-- No edit button for name -->
            </div>
            <div class="readonly-text">
              {{ editableForm.name || 'N/A' }}
            </div>
          </div>

          <!-- Email (read-only) -->
          <div class="field-group">
            <div class="field-header">
              <label class="label">
                <span>Email</span>
              </label>
              <!-- No edit button for email -->
            </div>
            <div class="readonly-text">
              {{ editableForm.email || 'N/A' }}
            </div>
          </div>

          <!-- Phone (editable) -->
          <div class="field-group">
            <div class="field-header">
              <label class="label">
                <span>Phone</span>
              </label>
              <div class="edit-toggle-right" @click="toggleEdit('phone')">
                <el-icon :style="{ color: isEditingPhone ? 'green' : '' }">
                  <component :is="isEditingPhone ? Check : Edit" />
                </el-icon>
                <span :style="{ color: isEditingPhone ? 'green' : '#3b2a22' }">
                  {{ isEditingPhone ? 'Save' : 'Edit' }}
                </span>
              </div>
            </div>

            <template v-if="!isEditingPhone">
              <div class="readonly-text">{{ editableForm.phone || 'N/A' }}</div>
            </template>
            <template v-else>
              <el-input
                v-model="editableForm.phone"
                @blur="blurFormatField('phone')"
                placeholder="Enter phone number"
                class="full-width-phone"
              >
                <template #prepend>+63</template>
              </el-input>
            </template>
          </div>

          <h3>Shipping Address</h3>
          <!-- Address (editable) -->
          <div class="field-group">
            <div class="field-header">
              <label class="label">
                <span>Address</span>
              </label>
              <div class="edit-toggle-right" @click="toggleEdit('address')">
                <el-icon :style="{ color: isEditingAddress ? 'green' : '' }">
                  <component :is="isEditingAddress ? Check : Edit" />
                </el-icon>
                <span
                  :style="{ color: isEditingAddress ? 'green' : '#3b2a22' }"
                >
                  {{ isEditingAddress ? 'Save' : 'Edit' }}
                </span>
              </div>
            </div>

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

          <div class="form-section">
            <h3>Additional Notes</h3>
            <el-input
              v-model="editableForm.notes"
              type="textarea"
              placeholder="Optional instructions or requests..."
            />
          </div>
        </div>
      </el-form>
    </div>

    <div class="checkout-summary">
      <OrderSummary
        :selectedItems="selectedItems"
        button-label="Place Order"
        @button-click="placeOrder"
      />
    </div>
  </div>
</template>

<style scoped>
.checkout {
  display: grid;
  width: 80%;
  grid-template-columns: 1.3fr 1fr;
  gap: 30px;
  padding: 1.5rem;
  margin: 0 auto;
  max-width: 1200px;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #3b2a22;
}

.form-label {
  font-weight: 600;
  color: #3b2a22;
}

.readonly-text {
  color: #bba68b;
  font-size: 14px;
  padding: 3px 0px;
  border-radius: 4px;
  min-height: 2.5em;
  white-space: pre-wrap;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #3b2a22;
}

.field-group {
  margin-bottom: 1.5rem;
}

.label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #3b2a22;
}

/* New: header row puts the edit button on the right */
.field-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
}

.edit-toggle-right {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #3b2a22;
  user-select: none;
}

.edit-toggle-right:hover {
  opacity: 0.85;
}

.full-width-phone ::v-deep(.el-input__wrapper) {
  width: 100%;
}

.address-select-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.address-input,
.address-zip {
  margin-top: 0.75rem;
  width: 100%;
}

::v-deep(.el-form-item__error) {
  color: #d52128 !important;
}

@media (max-width: 768px) {
  .checkout {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem;
  }

  .checkout-form,
  .checkout-summary {
    width: 100%;
  }

  .checkout-summary {
    order: 3;
  }

  .address-select-group {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
