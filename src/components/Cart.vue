<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/pinia/cart'
import CartHeader from './cart/CartHeader.vue'
import CartCards from './cart/CartCards.vue'
import CartActions from './cart/CartActions.vue'
import OrderSummary from './cart/OrderSummary.vue'
import { ElMessageBox } from 'element-plus'

const cartStore = useCartStore()
const { selectedISBNs } = storeToRefs(cartStore)

const allISBNs = computed(() =>
  cartStore.items.map((item) => item.product.isbn),
)

const isAllSelected = computed(
  () =>
    allISBNs.value.length > 0 &&
    allISBNs.value.every((isbn) => selectedISBNs.value.has(isbn)),
)

function toggleCard(isbn: string) {
  selectedISBNs.value.has(isbn)
    ? selectedISBNs.value.delete(isbn)
    : selectedISBNs.value.add(isbn)
}

function toggleSelectAll() {
  isAllSelected.value
    ? selectedISBNs.value.clear()
    : (selectedISBNs.value = new Set(allISBNs.value))
}

async function removeSelected() {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to remove all selected items from your cart?',
      'Confirm Bulk Removal',
      {
        confirmButtonText: 'Remove All',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
    selectedISBNs.value.forEach((isbn) => cartStore.removeFromCart(isbn))
    selectedISBNs.value.clear()
  } catch {}
}

function checkoutSelected() {
  const selectedItems = cartStore.items.filter((item) =>
    selectedISBNs.value.has(item.product.isbn),
  )
  console.log('Proceeding to checkout with:', selectedItems)
}
</script>

<template>
  <div class="cart">
    <div class="cart-header">
      <CartHeader />
      <CartActions
        v-if="cartStore.items.length > 0"
        :isAllSelected="isAllSelected"
        :selectedISBNs="selectedISBNs"
        @toggleSelectAll="toggleSelectAll"
        @removeSelected="removeSelected"
        @checkoutSelected="checkoutSelected"
      />
    </div>

    <div class="cart-view">
      <CartCards
        :items="cartStore.items"
        :selectedISBNs="selectedISBNs"
        @toggleCard="toggleCard"
      />
    </div>

    <div class="order-summary">
      <OrderSummary
        v-if="cartStore.items.length > 0"
        :selectedItems="
          cartStore.items.filter((item) => selectedISBNs.has(item.product.isbn))
        "
      />
    </div>
  </div>
</template>

<style scoped>
.cart {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
}

.cart-header {
  grid-column: 1 / 2;
  grid-row: 1;
}

.cart-actions {
  grid-column-start: 3;
  grid-row-start: 1;
  margin-top: 1.5rem;
}

.cart-view {
  grid-column: 1;
  grid-row: 2;
}

.order-summary {
  grid-column: 2;
  grid-row: 2;
  padding-top: 1rem;
  margin-bottom: 1rem;
}
</style>
