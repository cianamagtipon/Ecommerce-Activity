<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/pinia/cart'

const cartStore = useCartStore()

const selectedItem = ref<{
  isbn: string
  title: string
  quantity: number
} | null>(null)
const dialogVisible = ref(false)

function onRowClick(item: (typeof cartStore.items)[0]) {
  selectedItem.value = {
    isbn: item.product.isbn,
    title: item.product.title,
    quantity: item.quantity,
  }
  dialogVisible.value = true
}

function confirmQuantityUpdate() {
  if (selectedItem.value) {
    cartStore.updateQuantity(
      selectedItem.value.isbn,
      selectedItem.value.quantity,
    )
    dialogVisible.value = false
  }
}

function confirmRemove() {
  if (selectedItem.value) {
    cartStore.removeFromCart(selectedItem.value.isbn)
    dialogVisible.value = false
  }
}
</script>

<template>
  <div class="cart">
    <h2>Your Cart</h2>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <el-table
        class="populated-cart"
        :data="cartStore.items"
        style="width: 100%"
        @row-click="onRowClick"
        highlight-current-row
      >
        <el-table-column label="Title" min-width="200" prop="product.title" />
        <el-table-column label="Price" min-width="200" align="center">
          <template #default="{ row }">₱{{ row.product.retail }}</template>
        </el-table-column>
        <el-table-column label="Quantity" min-width="200" align="center">
          <template #default="{ row }">{{ row.quantity }}</template>
        </el-table-column>
      </el-table>

      <p class="total">
        <strong>Total:</strong> ₱{{ cartStore.totalPrice.toFixed(2) }}
      </p>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="Update or Remove Item"
      width="400px"
      align-center
    >
      <template v-if="selectedItem">
        <p>
          <strong>{{ selectedItem.title }}</strong>
        </p>

        <div class="dialog-controls">
          <label>Quantity:</label>
          <el-input-number
            v-model="selectedItem.quantity"
            :min="1"
            :max="99"
            step-strictly
          />
        </div>

        <div class="dialog-buttons">
          <div class="left-button">
            <el-button type="primary" @click="confirmQuantityUpdate"
              >Update</el-button
            >
          </div>
          <div class="right-button">
            <el-button type="danger" plain @click="confirmRemove"
              >Remove</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.cart {
  padding: 1rem;
  color: #5d3d2e;
}

.populated-cart {
  cursor: pointer;
}

.total {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  text-align: right;
}

.dialog-controls {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
}

.left-button,
.right-button {
  flex: 1;
  display: flex;
}

.left-button {
  justify-content: flex-start;
}

.right-button {
  justify-content: flex-end;
}
</style>
