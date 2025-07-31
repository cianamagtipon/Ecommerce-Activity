<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/pinia/cart'
import { ElMessageBox } from 'element-plus'
import { useCheckoutStore } from '@/pinia/checkout'

import CartHeader from './cart/CartHeader.vue'
import CartCards from './cart/CartCards.vue'
import CartActions from './cart/CartActions.vue'
import OrderSummary from './OrderSummary.vue'
import { useUserStore } from '../pinia/user'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

const allISBNs = computed(() =>
  cartStore.items.map((item) => item.product.isbn),
)

const isAllSelected = computed(
  () =>
    allISBNs.value.length > 0 &&
    allISBNs.value.every((isbn) => cartStore.selectedISBNs.has(isbn)),
)

function toggleCard(isbn: string) {
  if (cartStore.selectedISBNs.has(isbn)) {
    cartStore.selectedISBNs.delete(isbn)
  } else {
    cartStore.selectedISBNs.add(isbn)
  }
  cartStore.saveCartToStorage()
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    cartStore.selectedISBNs.clear()
  } else {
    cartStore.selectedISBNs = new Set(allISBNs.value)
  }
  cartStore.saveCartToStorage()
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
    cartStore.selectedISBNs.forEach((isbn) => cartStore.removeFromCart(isbn))
    cartStore.selectedISBNs.clear()
    cartStore.saveCartToStorage()
  } catch {}
}

function checkoutSelected() {
  const selectedItems = cartStore.items.filter((item) =>
    cartStore.selectedISBNs.has(item.product.isbn),
  )

  if (!selectedItems.length) return

  checkoutStore.setSelectedItems(selectedItems)

  const email = userStore.currentUser?.email
  if (!email) {
    if (typeof window.openLoginModal === 'function') {
      window.openLoginModal()
    } else {
      console.warn('Login modal function not found')
    }
    return
  }

  router.push('/checkout')
}

onBeforeMount(() => {
  cartStore.loadCartFromStorage()
})
</script>

<template>
  <div :class="['cart', { 'single-column': cartStore.items.length === 0 }]">
    <div class="cart-header">
      <CartHeader />
      <CartActions
        v-if="cartStore.items.length > 0"
        :isAllSelected="isAllSelected"
        :selectedISBNs="cartStore.selectedISBNs"
        @toggleSelectAll="toggleSelectAll"
        @removeSelected="removeSelected"
      />
    </div>

    <div class="cart-view">
      <CartCards
        :items="cartStore.items"
        :selectedISBNs="cartStore.selectedISBNs"
        @toggleCard="toggleCard"
      />
    </div>

    <div v-if="cartStore.items.length > 0" class="order-summary">
      <OrderSummary
        :selectedItems="
          cartStore.items.filter((item) =>
            cartStore.selectedISBNs.has(item.product.isbn),
          )
        "
        @button-click="checkoutSelected"
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
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
  width: 100%;
}

.single-column .cart-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.order-summary {
  grid-column: 2;
  grid-row: 2;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.single-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .cart {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    padding: 1rem;
  }

  .cart-header,
  .cart-view,
  .order-summary,
  .cart-actions {
    grid-column: unset;
    grid-row: unset;
    width: 100%;
  }

  .cart-header {
    order: 1;
  }

  .cart-actions {
    order: 2;
    margin-top: 0.5rem;
  }

  .cart-view {
    order: 3;
  }

  .order-summary {
    order: 4;
    padding-top: 1rem;
  }
}
</style>
