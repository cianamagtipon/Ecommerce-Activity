<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'

const props = defineProps<{
  selectedItems: { product: Product; quantity: number }[]
  buttonLabel?: string
}>()

const emit = defineEmits<{
  (e: 'button-click'): void
}>()

const orderTotal = computed(() =>
  props.selectedItems.reduce((sum, item) => {
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
  return rowIndex === props.selectedItems.length - 1
    ? 'last-row'
    : 'subtotal-row'
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

    <!-- <template #footer> -->
    <div v-if="selectedItems.length > 0">
      <h3>
        Order Total: <span class="total"> ₱{{ orderTotal.toFixed(2) }}</span>
      </h3>
      <el-button class="checkout-button" @click="$emit('button-click')">
        {{ buttonLabel || 'Checkout' }}
      </el-button>
    </div>
    <!-- </template> -->
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

/* remove element plus table cell borders */
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
