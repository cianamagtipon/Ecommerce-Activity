<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/pinia/cart'
import { ElMessageBox } from 'element-plus'

const cartStore = useCartStore()

const selectedISBNs = ref<Set<string>>(new Set())

function toggleCard(isbn: string) {
  if (selectedISBNs.value.has(isbn)) {
    selectedISBNs.value.delete(isbn)
  } else {
    selectedISBNs.value.add(isbn)
  }
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
    // user canceled - does nothing
  }
}
</script>

<template>
  <div class="cart">
    <div class="cart-header">
      <h2>Your Cart</h2>
      <span class="total-amount">
        <strong>Total:</strong> ₱{{ cartStore.totalPrice.toFixed(2) }}
      </span>
    </div>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
    </div>

    <div v-else class="cart-list">
      <div
        v-for="item in cartStore.items"
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
              @change="
                () => cartStore.updateQuantity(item.product.isbn, item.quantity)
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0 auto;
  padding: 0 0.5rem;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.total-amount {
  font-size: 1.2rem;
  white-space: nowrap;
}

.empty-cart {
  padding: 2rem;
  text-align: center;
  font-style: italic;
}

.cart-list {
  display: grid;
  gap: 1rem;
  margin: 1rem auto 0;
  width: 100%;
  max-width: 900px;
  padding: 1rem;
  box-sizing: border-box;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.cart-card {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  box-sizing: border-box;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #d6c9bb;
  color: #3b2a22;
  box-shadow: 0 3px 7px rgba(93, 61, 46, 0.08);
  border-radius: 5px;
  background-color: #fff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.cart-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(93, 61, 46, 0.2);
}

.cart-card.selected {
  border: 1.4px solid #5d3d2e;
  background-color: #fdf7f3;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(93, 61, 46, 0.2);
}

.product-image {
  width: 100px;
  height: 140px;
  object-fit: contain;
  border-radius: 6px;
  flex-shrink: 0;
}

.remove-btn {
  position: absolute;
  top: 6px;
  right: 10px;
  background: transparent;
  border: none;
  color: #bba68b;
  font-size: 28px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.remove-btn:hover {
  color: #3b2a22;
}

.product-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 0.5rem;

  gap: 0.4rem;
}

.product-details h3 {
  margin-bottom: 1rem; /* reduces space below title */
}

.product-details p {
  margin-top: 0; /* removes extra space above price */
  margin-bottom: 1rem; /* space below price */
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  text-align: right;
}

.discounted {
  color: #b94d3d;
  font-size: 17px;
  font-weight: 600;
  margin-right: 1rem;
}

.discount {
  color: #bba68b;
  font-size: 14px;
  font-weight: 600;
  margin-left: 0.5rem;
}

.under-retail {
  display: block;
  margin-top: 5px;
}

del {
  color: #999;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .cart-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .cart-list {
    grid-template-columns: 1fr;
  }
}
</style>
