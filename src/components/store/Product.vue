<script setup lang="ts">
import { useProductStore } from '@/pinia/products'
import { useCartStore } from '@/pinia/cart'
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'

const props = defineProps<{ id: string }>()

const productStore = useProductStore()
const cartStore = useCartStore()
const quantity = ref(1)

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})

const product = computed(() =>
  productStore.products.find((p) => p.isbn === props.id),
)

async function handleAddToCart() {
  if (!product.value) return

  const prod = product.value

  const existingItem = cartStore.items.find(
    (item) => item.product.isbn === prod.isbn,
  )

  if (existingItem) {
    try {
      await ElMessageBox.confirm(
        `You have ${existingItem.quantity} of the same item in your cart.\n
        Would you like to add ${quantity.value} more?`,
        'Item Already in Cart',
        {
          confirmButtonText: 'Add to Cart',
          cancelButtonText: 'Cancel',
          type: 'warning',
        },
      )
      cartStore.addToCart(prod, quantity.value)
      quantity.value = 1
    } catch {
      // cancel clicked. does nothing.
    }
  } else {
    cartStore.addToCart(prod, quantity.value)
    quantity.value = 1
  }
}

watch(product, (newProduct) => {
  if (!newProduct) return

  const item = cartStore.items.find(
    (item) => item.product.isbn === newProduct.isbn,
  )
  quantity.value = item ? item.quantity : 1
})
</script>

<template>
  <div class="product-view">
    <div v-if="product">
      <h1>{{ product.title }}</h1>
      <p><strong>Author:</strong> {{ product.author }}</p>
      <p><strong>Price:</strong> ₱{{ product.retail }}</p>
      <p><strong>Discount:</strong> -{{ product.discount }}%</p>
      <p><strong>Category:</strong> {{ product.genre }}</p>

      <div class="quantity-control">
        <label><strong>Quantity: </strong></label>
        <el-input-number
          v-model="quantity"
          :min="1"
          :max="99"
          size="small"
          @click.stop
        />
      </div>

      <div class="add-cart">
        <el-button class="cart-button" @click="handleAddToCart">
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
