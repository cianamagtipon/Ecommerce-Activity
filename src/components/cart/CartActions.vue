<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/pinia/cart'

const cartStore = useCartStore()
const { selectedISBNs, isAllSelected } = storeToRefs(cartStore)
</script>

<template>
  <div class="cart-actions">
    <div class="left-group">
      <input
        type="checkbox"
        :checked="isAllSelected"
        @change="cartStore.toggleSelectAll"
        id="select-all-checkbox"
      />

      <label for="select-all-checkbox">Select All</label>
    </div>

    <div class="right-group">
      <button
        class="bulk-action danger"
        @click="$emit('removeSelected')"
        :disabled="selectedISBNs.size === 0"
      >
        Delete Selected
      </button>
    </div>
  </div>
</template>

<style scoped>
.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 1rem;
  font-weight: 600;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.right-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bulk-action {
  margin-left: 1rem;
  padding: 6px 12px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.bulk-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bulk-action.danger {
  background-color: #d9534f;
  color: white;
}

.bulk-action.danger:hover:not(:disabled) {
  background-color: #c9302c;
}

.bulk-action.primary {
  background-color: #5d3d2e;
  color: white;
}

.bulk-action.primary:hover:not(:disabled) {
  background-color: #3b2a22;
}

@media (max-width: 500px) {
  .cart-actions {
    padding: 0;
  }
}
</style>
