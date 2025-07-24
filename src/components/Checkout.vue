<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/pinia/user'
import { useCartStore } from '@/pinia/cart'
import { ElMessage } from 'element-plus'
import { Edit, Check } from '@element-plus/icons-vue'

import type { FormInstance } from 'element-plus'

import OrderSummary from './OrderSummary.vue'

const userStore = useUserStore()
const cartStore = useCartStore()

const isEditingPhone = ref(false)
const isEditingAddress = ref(false)

const editableForm = ref({
  name: userStore.name,
  email: userStore.email,
  phone: userStore.phone,
  address: userStore.address,
  notes: '',
})

const formRef = ref<FormInstance | null>(null)

const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
  address: [
    { required: true, message: 'Address is required', trigger: 'blur' },
  ],
}

const selectedItems = computed(() =>
  cartStore.items.filter((item) =>
    cartStore.selectedISBNs.has(item.product.isbn),
  ),
)

function placeOrder() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('Name and address are required to place an order.')
      return
    }

    // Save to user store
    userStore.name = editableForm.value.name
    userStore.email = editableForm.value.email
    userStore.phone = editableForm.value.phone
    userStore.address = editableForm.value.address

    // Proceed with order logic
    console.log('Placing order with:', {
      user: editableForm.value,
      items: selectedItems.value,
    })
    ElMessage.success('Order placed successfully!')
  })
}

function togglePhoneEdit() {
  if (isEditingPhone.value) {
    userStore.phone = editableForm.value.phone
  }
  isEditingPhone.value = !isEditingPhone.value
}

function toggleAddressEdit() {
  if (isEditingAddress.value) {
    userStore.address = editableForm.value.address
  }
  isEditingAddress.value = !isEditingAddress.value
}
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
        :rules="rules"
        label-position="top"
        hide-required-asterisk
      >
        <div class="form-section">
          <h3>Personal Information</h3>
          <el-form-item>
            <template #label>
              <span class="form-label">Name</span>
            </template>
            <div class="readonly-text">{{ editableForm.name || 'N/A' }}</div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="form-label">Email</span>
            </template>
            <div class="readonly-text">{{ editableForm.email || 'N/A' }}</div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <div class="label-with-icon">
                <span>Phone</span>
                <div class="edit-icon" @click="togglePhoneEdit">
                  <el-icon
                    :style="{
                      fontSize: '16px',
                      color: isEditingPhone ? 'green' : '',
                    }"
                  >
                    <component :is="isEditingPhone ? Check : Edit" />
                  </el-icon>
                  <span
                    class="edit-text"
                    :style="{ color: isEditingPhone ? 'green' : '#3b2a22' }"
                  >
                    {{ isEditingPhone ? 'Save' : 'Edit' }}
                  </span>
                </div>
              </div>
            </template>

            <template v-if="!isEditingPhone">
              <div class="readonly-text">{{ editableForm.phone || 'N/A' }}</div>
            </template>
            <template v-else>
              <el-input
                v-model="editableForm.phone"
                placeholder="Enter phone number"
                class="editable-field full-width-phone"
              >
                <template #prepend>+63</template>
              </el-input>
            </template>
          </el-form-item>

          <h3>Shipping Address</h3>
          <el-form-item prop="address">
            <template #label>
              <div class="label-with-icon">
                <span>
                  Address<span style="color: #d52128; margin-left: 5px">*</span>
                </span>

                <div class="edit-icon" @click="toggleAddressEdit">
                  <el-icon
                    :style="{
                      fontSize: '16px',
                      color: isEditingAddress ? 'green' : '',
                    }"
                  >
                    <component :is="isEditingAddress ? Check : Edit" />
                  </el-icon>
                  <span
                    class="edit-text"
                    :style="{ color: isEditingAddress ? 'green' : '#3b2a22' }"
                  >
                    {{ isEditingAddress ? 'Save' : 'Edit' }}
                  </span>
                </div>
              </div>
            </template>

            <template v-if="!isEditingAddress">
              <div class="readonly-text">
                {{ editableForm.address || 'N/A' }}
              </div>
            </template>

            <template v-else>
              <el-input
                v-model="editableForm.address"
                type="textarea"
                placeholder="Enter shipping address"
                class="editable-field full-width-address"
              />
            </template>
          </el-form-item>
        </div>

        <div class="form-section">
          <h3>Additional Notes</h3>
          <el-form-item>
            <template #label>
              <span class="form-label">Notes</span>
            </template>
            <el-input
              v-model="editableForm.notes"
              type="textarea"
              placeholder="Optional instructions or requests..."
            />
          </el-form-item>
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
  grid-template-columns: 1.3fr 1fr; /* for record keeping: was 2fr 1fr */
  gap: 30px; /* for record keeping: was 50px */
  padding: 1.5rem; /* for record keeping: was 2rem */
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
  padding: 4px 0;
  width: 100%;
  min-height: 3em; /* match with textarea */
  white-space: pre-wrap; /* if you want multiline display */
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

.label-with-icon {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #3b2a22;
}

.edit-icon {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  margin-left: auto;
  font-weight: 500;
  color: #3b2a22;
}

.edit-icon:hover {
  opacity: 0.8;
}

.edit-text {
  font-size: 13px;
}

.full-width-address ::v-deep(.el-textarea__inner) {
  width: 100%;
  min-height: 3em; /* match readonly-text block */
  font-size: 14px;
  color: #bba68b;
}

.full-width-phone ::v-deep(.el-input__wrapper) {
  width: 100%;
}

::v-deep(.el-form-item__error) {
  color: #d52128 !important;
}

@media (max-width: 768px) {
  .checkout {
    display: flex;
    flex-direction: column;
  }

  .checkout-form,
  .checkout-summary {
    width: 100%;
  }

  .checkout-summary {
    order: 3;
  }
}
</style>
