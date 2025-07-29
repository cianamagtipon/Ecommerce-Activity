<script setup lang="ts">
import { useProductStore } from '@/pinia/products'
import { useCartStore } from '@/pinia/cart'
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StoreCards from './StoreCards.vue'

import 'element-plus/es/components/message-box/style/css'

const props = defineProps<{ id: string }>()

const productStore = useProductStore()
const cartStore = useCartStore()
const quantity = ref(1)

const product = computed(() =>
  productStore.products.find((p) => p.isbn === props.id),
)

const fallbackImage =
  'https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg'

const suggestedProducts = computed(() => {
  const filtered = productStore.products.filter((p) => p.isbn !== props.id)

  const shuffled = [...filtered].sort(() => Math.random() - 0.5)

  return shuffled.slice(0, 4)
})

async function handleAddToCart() {
  if (!product.value) return

  const prod = product.value

  const existingItem = cartStore.items.find(
    (item) => item.product.isbn === prod.isbn,
  )

  try {
    if (existingItem) {
      await ElMessageBox.confirm(
        `You have ${existingItem.quantity} of the same item in your cart.\nWould you like to add ${quantity.value} more?`,
        'Item Already in Cart',
        {
          confirmButtonText: 'Add to Cart',
          cancelButtonText: 'Cancel',
          type: 'warning',
        },
      )
    } else {
      await ElMessageBox.confirm(
        `Would you like to add "${prod.title}" to your cart?`,
        'Add to Cart',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'info',
        },
      )
    }

    cartStore.addToCart(prod, quantity.value)
    quantity.value = 1
    ElMessage.success('Added to cart!')
  } catch {}
}

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})

watch(product, (newProduct) => {
  if (!newProduct) return

  const item = cartStore.items.find(
    (item) => item.product.isbn === newProduct.isbn,
  )
  quantity.value = item ? item.quantity : 1
})
</script>

<template>
  <div class="product-view-container">
    <div v-if="product" class="product-detail">
      <div class="product-image">
        <img :src="fallbackImage" alt="Book Cover" />
      </div>

      <div class="product-info">
        <h1 class="product-title">{{ product.title }}</h1>
        <p class="product-author">by {{ product.author }}</p>

        <div class="price-block">
          <template v-if="product.discount > 0">
            <span class="original-price">₱{{ product.retail.toFixed(2) }}</span>
            <span class="price"
              >₱{{
                (product.retail * (1 - product.discount / 100)).toFixed(2)
              }}</span
            >
            <span class="discount">-{{ product.discount }}%</span>
          </template>
          <template v-else>
            <span class="price">₱{{ product.retail.toFixed(2) }}</span>
          </template>
        </div>

        <div class="product-meta">
          <p><strong>Genre:</strong> {{ product.genre }}</p>
          <p>
            <strong>Published:</strong>
            {{ new Date(product.publishDate).toLocaleDateString() }}
          </p>
        </div>

        <div class="product-rating">
          <el-rate
            :model-value="product.rating"
            disabled
            allow-half
            show-score
          />
        </div>

        <div class="quantity-cart">
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="99"
            size="small"
            @click.stop
            @blur="
              () => {
                if (!quantity || quantity < 1) quantity = 1
              }
            "
          />
          <el-button class="cart-button" @click="handleAddToCart">
            Add to Cart
          </el-button>
        </div>
      </div>
    </div>

    <div v-else class="no-product">
      <h1>Product not found.</h1>
    </div>

    <div class="suggested-section" v-if="product">
      <h2>Suggested Books</h2>
      <StoreCards :products="suggestedProducts" :showAddToCart="false" />
    </div>
  </div>
</template>

<style scoped>
.product-view-container {
  padding: 2rem;
  color: #4e342e;
  font-family: 'Segoe UI', sans-serif;
}

.product-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 5rem;
  margin-bottom: 3rem;
}

.product-image img {
  width: 280px;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.product-author {
  font-style: italic;
  color: #8b5e3c;
  margin-bottom: 0.5rem;
}

.price-block {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.6rem;
  color: #5d3d2e;
  font-weight: bold;
}

.original-price {
  text-decoration: line-through;
  color: #bba68b;
  font-size: 1.6rem;
  font-weight: bold;
}

.discount {
  background: #f8e1c3;
  color: #b84727;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-weight: 700;
}

.product-meta p {
  margin: 0;
  line-height: 1.4;
}

.product-rating {
  margin-top: 0.5rem;
}

.quantity-cart {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.cart-button {
  background-color: #5d3d2e;
  color: white;
  border: none;
  border-radius: 8px;
}

.no-product {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.suggested-section {
  margin-top: 5rem;
}

.suggested-section h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.suggested-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.suggested-card {
  background: white;
  border: 1px solid #f0e0d6;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.suggested-card:hover {
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
}

.suggested-card img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.suggested-card .title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #5d3d2e;
  margin: 0.25rem 0;
}

.suggested-card .author {
  font-size: 0.85rem;
  color: #a98274;
}
</style>
