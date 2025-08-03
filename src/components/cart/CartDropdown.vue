<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useCartStore } from '@/pinia/cart'
import { useCheckoutStore } from '@/pinia/checkout'
import { useUserStore } from '@/pinia/user'

import { Delete } from '@element-plus/icons-vue'
import { ShoppingCartIcon } from '@heroicons/vue/24/solid'

const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

const fallbackImage =
  'https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg'

const totalItems = computed(() => cartStore.items.length)
const isDropdownOpen = ref(false)

function handleVisibleChange(visible: boolean) {
  isDropdownOpen.value = visible
}

function goToCart() {
  router.push('/cart')
}

function removeItem(isbn: string) {
  cartStore.removeFromCart(isbn)
}

function loadProductData() {
  const genre = route.params.genre as string
  const id = route.params.id as string
  console.log('Fetching product', genre, id)
}

const subtotal = computed(() =>
  cartStore.items
    .reduce((sum, item) => {
      const price = item.product.retail * (1 - item.product.discount / 100)
      return sum + price * item.quantity
    }, 0)
    .toFixed(2),
)

function handleCheckout() {
  const selectedItems = [...cartStore.items]
  if (!selectedItems.length) return

  const allISBNs = selectedItems.map((item) => item.product.isbn)
  cartStore.selectedISBNs = new Set(allISBNs)

  checkoutStore.setSelectedItems(selectedItems)
  localStorage.setItem('currentOrder', JSON.stringify(selectedItems))

  const email = userStore.currentUser?.email
  if (!email) {
    window.openLoginModal?.()
    return
  }

  isDropdownOpen.value = false
  router.push('/checkout')
}

onMounted(() => {
  if (!checkoutStore.selectedItems.length) {
    const raw = localStorage.getItem('currentOrder')
    if (raw) {
      checkoutStore.setSelectedItems(JSON.parse(raw))
    }
  }
})

watch(
  () => [route.params.genre, route.params.id],
  () => {
    loadProductData()
  },
)
</script>

<template>
  <el-dropdown trigger="click" @visible-change="handleVisibleChange">
    <span class="el-dropdown-link cart-trigger">
      <el-badge
        :value="totalItems"
        class="cart-icon"
        :hidden="totalItems === 0"
      >
        <ShoppingCartIcon
          :class="['big-cart-icon', { active: isDropdownOpen }]"
        />
      </el-badge>
      <span :class="['cart-label', { active: isDropdownOpen }]">Cart</span>
    </span>

    <template #dropdown>
      <el-dropdown-menu class="cart-dropdown">
        <div v-if="totalItems > 0" class="dropdown-content">
          <p class="edit-note">
            Note: Modify your orders by viewing the full cart.
          </p>

          <div class="scrollable-wrapper">
            <div class="scrollable-list">
              <router-link
                v-for="item in cartStore.items"
                :key="item.product.isbn"
                :to="{
                  name: 'product',
                  params: {
                    genre: item.product.genre.toLowerCase(),
                    id: item.product.isbn,
                  },
                }"
                custom
                v-slot="{ navigate }"
              >
                <div
                  class="mini-cart-card"
                  @click="
                    () => {
                      navigate()
                      isDropdownOpen = false
                    }
                  "
                >
                  <el-image
                    class="mini-image"
                    :src="fallbackImage"
                    fit="contain"
                    :preview-src-list="[]"
                  />
                  <div class="mini-details">
                    <div class="title">{{ item.product.title }}</div>
                    <div class="price">
                      ₱{{
                        (
                          item.product.retail *
                          (1 - item.product.discount / 100)
                        ).toFixed(2)
                      }}
                      × {{ item.quantity }}
                    </div>
                  </div>

                  <button
                    class="remove-btn"
                    @click.stop="removeItem(item.product.isbn)"
                  >
                    <el-icon><Delete /></el-icon>
                  </button>
                </div>
              </router-link>
            </div>
          </div>

          <div class="subtotal">Subtotal: ₱{{ subtotal }}</div>
          <div class="action-buttons">
            <el-button
              size="small"
              class="view-cart-btn"
              @click="goToCart"
              plain
            >
              View Full Cart ({{ totalItems }})
            </el-button>
            <el-button
              size="small"
              class="checkout-btn"
              @click="handleCheckout"
            >
              Checkout
            </el-button>
          </div>
        </div>
        <div v-else class="empty-state">
          <el-empty description="Your cart is empty." />
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.cart-icon {
  cursor: pointer;
}

.big-cart-icon {
  width: 20px;
  height: 20px;
  color: #bba68b;
  transition: color 0.2s ease;
}

.big-cart-icon:hover {
  color: #5d3d2e;
}

.big-cart-icon:active {
  color: #3b2a22;
  transform: scale(0.95);
}

.big-cart-icon.active {
  color: #5d3d2e;
}

.cart-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #bba68b;
  cursor: pointer;
  transition: color 0.2s ease;
}

.cart-trigger:hover .big-cart-icon,
.cart-trigger:hover .cart-label {
  color: #5d3d2e;
}

.cart-label {
  font-size: 15px;
  transition: color 0.2s ease;
  color: #bba68b;
}

.cart-label.active {
  color: #5d3d2e;
}

.cart-dropdown {
  width: 320px;
  padding: 10px;
}

.dropdown-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mini-cart-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fffdfb;
  border: 1px solid #d6c9bb;
  border-radius: 6px;
  padding: 6px 10px;
  box-shadow: 0 2px 4px rgba(93, 61, 46, 0.1);
  position: relative;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.mini-cart-card:hover {
  background-color: #f5eee7;
  border-color: #c2b2a2;
}

.mini-image {
  width: 40px;
  height: 55px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.mini-details {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #3b2a22;
  min-width: 0;
  overflow: hidden;
}

.title {
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  font-size: 12px;
  color: #888;
}

.edit-note {
  font-size: 12px;
  font-style: italic;
  color: #3b2a22;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #bba68b;
  font-size: 18px;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #3b2a22;
}

.subtotal {
  text-align: center;
  font-size: 13px;
  color: #3b2a22;
  font-weight: 500;
  margin: 4px 0 2px;
}

.action-buttons {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.checkout-btn {
  background-color: #5d3d2e !important;
  border-color: #5d3d2e !important;
  color: #fffdfb !important;
  transition: background-color 0.2s ease;
  flex: 1;
}

.checkout-btn:hover {
  background-color: #3b2a22 !important;
  border-color: #3b2a22 !important;
}

.view-cart-btn {
  flex: 1;
  border-color: #5d3d2e !important;
  color: #5d3d2e !important;
}

.view-cart-btn:hover {
  color: #3b2a22 !important;
  border-color: #3b2a22 !important;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.scrollable-wrapper {
  position: relative;
  max-height: 300px;
  overflow: hidden;
}

.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
  z-index: 1;
}

.scrollable-list::-webkit-scrollbar {
  width: 6px;
}
.scrollable-list::-webkit-scrollbar-thumb {
  background-color: #cbbba5;
  border-radius: 3px;
}
.scrollable-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>
