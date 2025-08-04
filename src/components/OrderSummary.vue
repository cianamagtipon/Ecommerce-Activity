<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useCheckoutStore } from '@/pinia/checkout'
import { useUserStore } from '@/pinia/user'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/pinia/cart'

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const cartStore = useCartStore()

const props = defineProps<{
  selectedItems?: { product: Product; quantity: number }[]
  buttonLabel?: string
  formRef?: FormInstance | null
}>()

const emit = defineEmits<{
  (e: 'button-click'): void
  (e: 'login-clicked'): void
}>()

const checkoutStore = useCheckoutStore()

const selectedItems = computed(() =>
  props.selectedItems?.length
    ? props.selectedItems
    : checkoutStore.selectedItems,
)

const orderTotal = computed(() =>
  selectedItems.value.reduce((sum, item) => {
    const discountedPrice =
      item.product.retail * (1 - item.product.discount / 100)
    return sum + discountedPrice * item.quantity
  }, 0),
)

function getDiscountedPrice(row: { product: Product; quantity: number }) {
  const { retail, discount } = row.product
  return retail * (1 - discount / 100)
}

function getRowClassName({ rowIndex }: { rowIndex: number }) {
  return rowIndex === selectedItems.value.length - 1
    ? 'last-row'
    : 'subtotal-row'
}

async function handleCheckout() {
  if (!userStore.currentUser) {
    // trigger login when logged out
    window.openLoginModal?.()
    return
  }

  // if in checkout: place order
  if (route.name === 'checkout') {
    if (props.formRef) {
      try {
        await props.formRef.validate()
        emit('button-click')

        // clear items when order is placed
        const selectedISBNs = checkoutStore.selectedItems.map(
          (item) => item.product.isbn,
        )
        selectedISBNs.forEach((isbn) => cartStore.removeFromCart(isbn))
        cartStore.saveCartToStorage()

        // clear checkout state
        checkoutStore.clearSelectedItems()
        localStorage.removeItem('currentOrder')
      } catch (err) {
        ElMessage.error('Please complete all required fields.')
      }
    } else {
      emit('button-click')
    }
    return
  }

  // go to checkout
  checkoutStore.setSelectedItems(selectedItems.value)
  router.push('/checkout')
}
</script>

<template>
  <el-card class="order-card">
    <template #header>
      <h2>Order Summary</h2>
    </template>

    <div v-if="selectedItems.length > 0">
      <p><strong>Subtotal</strong></p>

      <div class="table-container">
        <el-table
          :data="selectedItems"
          size="medium"
          :border="false"
          :show-header="false"
          :row-class-name="getRowClassName"
          class="subtotal-table"
          style="margin-bottom: 1rem"
        >
          <el-table-column>
            <template #default="{ row }">
              <div class="subtotal">
                <div class="left">
                  {{ row.product.title }}
                </div>
                <div class="right">
                  <strong>
                    ₱{{ getDiscountedPrice(row).toFixed(2) }} ×
                    {{ row.quantity }}
                  </strong>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-else>
      <p>No items selected.</p>
    </div>

    <div v-if="selectedItems.length > 0">
      <h3>
        Order Total: <span class="total">₱{{ orderTotal.toFixed(2) }}</span>
      </h3>
      <el-button class="checkout-button" @click="handleCheckout">
        {{ buttonLabel || 'Checkout' }}
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.order-card {
  width: 340px;
  max-width: 100%;
  border: 1px solid #d6c9bb;
  color: #3b2a22;
  box-shadow: 0 3px 7px rgba(93, 61, 46, 0.08);
  margin: 0 auto;
}

@media (max-width: 400px) {
  .order-card {
    width: 100%;
  }
}

.table-container {
  max-height: 245px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.subtotal {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  border-bottom: 1px solid #00000034;
  padding: 0.5rem 0;
}

.left {
  overflow: hidden;
  text-overflow: clip;
}

.right {
  text-align: right;
  white-space: nowrap;
}

.total {
  color: #b94d3d;
}

.checkout-button {
  width: 100%;
  background-color: #5d3d2e;
  color: white;
  font-weight: 600;
}

.subtotal-table ::v-deep(.el-table__cell) {
  border-bottom: none !important;
  padding: 0.2rem;
}

.subtotal-table ::v-deep(.subtotal:last-of-type) {
  border-bottom: none !important;
}

.subtotal-table ::v-deep(.el-table) {
  border: none !important;
}
</style>
