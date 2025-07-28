<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/pinia/cart'
import { ShoppingCart, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const cartStore = useCartStore()
const router = useRouter()
const fallbackImage =
  'https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg'

const totalItems = computed(() => cartStore.items.length)
const previewItems = computed(() => cartStore.items.slice(0, 3))

function goToCart() {
  router.push('/cart')
}

function removeItem(isbn: string) {
  cartStore.removeFromCart(isbn)
}

onMounted(() => {
  cartStore.loadCartFromStorage()
})
</script>

<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <el-badge
        :value="totalItems"
        class="cart-icon"
        :hidden="totalItems === 0"
      >
        <el-icon><ShoppingCart /></el-icon>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu class="cart-dropdown">
        <div v-if="totalItems > 0" class="dropdown-content">
          <div
            v-for="item in previewItems"
            :key="item.product.isbn"
            class="mini-cart-card"
          >
            <el-image
              class="mini-image"
              :src="fallbackImage"
              fit="cover"
              :preview-src-list="[]"
            />

            <div class="mini-details">
              <div class="title">
                {{ item.product.title }}
              </div>
              <div class="price">
                ₱
                {{
                  (
                    item.product.retail *
                    (1 - item.product.discount / 100)
                  ).toFixed(2)
                }}
                <span v-if="item.quantity > 1"> × {{ item.quantity }}</span>
              </div>
            </div>

            <button
              class="remove-btn"
              @click.stop="removeItem(item.product.isbn)"
            >
              <el-icon><Delete /></el-icon>
            </button>
          </div>

          <el-button
            type="primary"
            size="small"
            class="checkout-btn"
            @click="goToCart"
          >
            View Full Cart ({{ totalItems }})
          </el-button>
        </div>

        <div v-else class="empty-state">Your cart is empty.</div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.cart-icon {
  cursor: pointer;
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
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #3b2a22;
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
</style>
