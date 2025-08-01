<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/pinia/cart'
import { ElMessageBox } from 'element-plus'

import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const selectedISBNs = computed(() => cartStore.selectedISBNs)
const router = useRouter()

function goToStore() {
  router.push('/store')
}

const currentPage = ref(1)
const pageSize = ref(3) // customize per page

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return cartStore.items.slice(start, end)
})

function toggleCard(isbn: string) {
  if (selectedISBNs.value.has(isbn)) {
    selectedISBNs.value.delete(isbn)
  } else {
    selectedISBNs.value.add(isbn)
  }
  cartStore.saveCartToStorage()
}

async function confirmRemove(isbn: string) {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to remove this item from your cart?',
      'Confirm Removal',
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
    cartStore.removeFromCart(isbn)
  } catch {
    // User canceled
  }
}
</script>

<template>
  <div class="cart-container">
    <div class="cart-cards">
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <el-empty description="Your cart is empty">
          <el-button type="primary" class="store-button" @click="goToStore"
            >Check our store!</el-button
          >
        </el-empty>
      </div>

      <div v-else class="cart-list">
        <div
          v-for="item in paginatedItems"
          :key="item.product.isbn"
          class="cart-card"
          :class="{ selected: selectedISBNs.has(item.product.isbn) }"
          @click="toggleCard(item.product.isbn)"
        >
          <img
            class="product-image"
            src="https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
          />

          <div class="product-details">
            <button
              class="remove-btn"
              @click.stop="confirmRemove(item.product.isbn)"
              aria-label="Remove item"
            >
              ×
            </button>

            <h3>{{ item.product.title }}</h3>
            <!-- Main Price Display -->
            <p>
              <span v-if="item.product.discount > 0" class="discounted">
                ₱{{
                  (
                    item.product.retail *
                    (1 - item.product.discount / 100)
                  ).toFixed(2)
                }}
              </span>
              <span v-else
                ><strong>₱{{ item.product.retail.toFixed(2) }}</strong></span
              ><br />

              <!-- Original Price and Discount under Main Price -->
              <span v-if="item.product.discount > 0" class="under-retail">
                <del>₱{{ item.product.retail.toFixed(2) }}</del>
                <span class="discount"> -{{ item.product.discount }}%</span>
              </span>
            </p>

            <div class="quantity-control">
              <label>Quantity:</label>
              <el-input-number
                v-model="item.quantity"
                :min="1"
                :max="99"
                size="small"
                @click.stop
                @blur="
                  () => {
                    if (!item.quantity || item.quantity < 1) {
                      item.quantity = 1
                    }
                  }
                "
                @change="
                  () =>
                    cartStore.updateQuantity(item.product.isbn, item.quantity)
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      v-if="cartStore.items.length > pageSize"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="cartStore.items.length"
      size="small"
      layout="prev, pager, next"
      background
      class="pagination-bar"
    />
  </div>
</template>

<style scoped>
.cart-container {
  margin-bottom: 1rem;
}

.cart-cards {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Empty cart message */
.empty-cart {
  padding: 1.5rem;
  text-align: center;
  font-style: italic;
}

.store-button {
  background-color: #5d3d2e;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 10px 20px;
  font-size: 14px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.store-button:hover {
  background-color: #bba68b;
  color: #3b2a22;
  transform: scale(1.03);
}

/* Grid layout */
.cart-list {
  display: grid;
  gap: 0.75rem;
  width: 100%;
}

/* Individual cart card */
.cart-card {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #d6c9bb;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(93, 61, 46, 0.08);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.cart-card:hover,
.cart-card.selected {
  transform: scale(1.015);
  box-shadow: 0 4px 10px rgba(93, 61, 46, 0.18);
}

.cart-card.selected {
  border-color: #5d3d2e;
  background-color: #fdf7f3;
}

/* Product image */
.product-image {
  width: 90px;
  height: 120px;
  object-fit: contain;
  border-radius: 5px;
  flex-shrink: 0;
}

/* Remove button */
.remove-btn {
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 24px;
  color: #bba68b;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.remove-btn:hover {
  color: #3b2a22;
}

.product-details h3 {
  font-size: 14px;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.product-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Quantity + price section */
.quantity-control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  font-size: 13px;
}

/* Price display */
.discounted {
  color: #b94d3d;
  font-size: 13px;
  font-weight: 700;
  margin-right: 0.5rem;
}

.under-retail {
  display: block;
  margin-top: 4px;
  font-size: 12px;
}

.discount {
  color: #bba68b;
  font-weight: 600;
  font-size: 12px;
  margin-left: 0.4rem;
}

del {
  color: #999;
  font-size: 12px;
}

@media (max-width: 400px) {
  .cart-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }

  .product-image {
    margin-bottom: 0.5rem;
  }

  .quantity-control {
    justify-content: flex-start;
    margin-top: 0.5rem;
  }

  .product-details h3 {
    font-size: 13px;
  }
}
</style>

<style>
.el-pagination {
  font-size: 12px;
  height: 26px;
  --el-color-primary: #5d3d2e;
}

.el-pager li {
  height: 26px;
  line-height: 26px;
  min-width: 26px;
  font-size: 12px;
  padding: 0 6px;
  color: #5d3d2e;
}

.el-pager li.is-active {
  background-color: #5d3d2e;
  color: #bba68b;
  border-radius: 4px;
}

.el-pager li:hover {
  color: #5d3d2e;
}

/* hover for non-active page buttons */
.el-pagination.is-background .el-pager li:hover:not(.is-active) {
  background-color: #e6e0db;
}

/* hover color for prev/next arrows */
.el-pagination button:hover {
  color: #5d3d2e;
  background-color: #e6e0db;
}
</style>
