<script setup lang="ts">
import { useProductStore } from '@/pinia/products'
import { useCartStore } from '@/pinia/cart'
import type { Product } from '@/types/genre'
import { computed, onMounted } from 'vue'

const props = defineProps<{ id: string }>() // id from route

const productStore = useProductStore()
const cartStore = useCartStore()

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})

const product = computed(() =>
  productStore.products.find((p) => p.isbn === props.id),
)

function handleAddToCart(product: Product) {
  cartStore.addToCart(product)
}
</script>

<template>
  <div class="product-view">
    <div v-if="product">
      <h1>{{ product.title }}</h1>
      <p><strong>Author:</strong> {{ product.author }}</p>
      <p><strong>Price:</strong> ₱{{ product.retail }}</p>
      <p><strong>Discount:</strong> -{{ product.discount }}%</p>
      <p><strong>Category:</strong> {{ product.genre }}</p>
      <div class="add-cart">
        <el-button class="cart-button" @click="handleAddToCart(product)">
          Add to Cart
        </el-button>
      </div>
    </div>
    <div v-else class="no-product">
      <h1>Product not found.</h1>
    </div>
  </div>
</template>

<style scoped>
.product-view {
  color: #5d3d2e;
}

.no-product {
  min-height: 80vh;
  display: flex;
  align-items: center;
  color: #5d3d2e;
}

.cart-button {
  margin-top: 10px;
  border: none;
  color: white;
  background-color: #5d3d2e;
}
</style>
