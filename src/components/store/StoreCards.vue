<script setup lang="ts">
import type { Product } from '@/types/product'
import { ShoppingCart } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useCartStore } from '@/pinia/cart'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  products: Product[]
}>()

const cartStore = useCartStore()

const itemsPerRow = ref(4)

function updateItemsPerRow() {
  const width = window.innerWidth
  if (width < 900) {
    itemsPerRow.value = 2
  } else if (width < 1200) {
    itemsPerRow.value = 3
  } else {
    itemsPerRow.value = 4
  }
}

onMounted(() => {
  updateItemsPerRow()
  window.addEventListener('resize', updateItemsPerRow)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerRow)
})

const currentPage = ref(1)
const pageSize = computed(() => itemsPerRow.value * 3) // 3 rows per page

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.products.slice(start, end)
})

watch(currentPage, () => {
  const grid = document.querySelector('.product-grid')
  grid?.scrollIntoView({ behavior: 'smooth' })
})

function discounted(book: Product) {
  return (book.retail * (1 - book.discount / 100)).toFixed(2)
}

function addToCart(book: Product, event: Event) {
  event.preventDefault()
  event.stopPropagation()

  const existingItem = cartStore.items.find(
    (item) => item.product.isbn === book.isbn,
  )
  const quantity = 1

  if (existingItem) {
    ElMessageBox.confirm(
      `You already have ${existingItem.quantity} of "${book.title}" in your cart.\nWould you like to add ${quantity} more?`,
      'Item Already in Cart',
      {
        confirmButtonText: 'Add to Cart',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
      .then(() => {
        cartStore.addToCart(book, quantity)
        ElMessage.success('Added to cart!')
      })
      .catch(() => {})
  } else {
    ElMessageBox.confirm(
      `Would you like to add "${book.title}" to your cart?`,
      'Add to Cart',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'info',
      },
    )
      .then(() => {
        cartStore.addToCart(book, quantity)
        ElMessage.success('Added to cart!')
      })
      .catch(() => {})
  }
}
</script>

<template>
  <div class="product-page">
    <TransitionGroup
      name="fade-slide"
      tag="div"
      class="card-container product-grid"
    >
      <router-link
        v-for="book in paginatedProducts"
        :key="book.isbn"
        :to="{
          name: 'product',
          params: { genre: book.genre.toLowerCase(), id: book.isbn },
        }"
        class="book-link"
      >
        <el-card class="book-card" shadow="hover">
          <div
            v-if="
              book.rating >= 4 ||
              new Date(book.publishDate).getFullYear() >= 2020
            "
            class="tag-container"
          >
            <div
              v-if="new Date(book.publishDate).getFullYear() >= 2020"
              class="tag"
            >
              NEW
            </div>
            <div v-if="book.rating >= 4" class="tag">BESTSELLER</div>
          </div>

          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
            style="width: 100%"
          />

          <div class="card-info">
            <div class="book-info">
              <p>
                <span class="title"
                  ><strong>{{ book.title }}</strong></span
                ><br />
                <span class="author">{{ book.author }}</span>
              </p>
            </div>

            <div class="book-price">
              <p>
                <span v-if="book.discount > 0" class="discounted">
                  ₱{{ discounted(book) }}
                </span>
                <span v-else
                  ><strong>₱{{ book.retail }}</strong></span
                ><br />
                <span v-if="book.discount > 0" class="under-retail">
                  <del>₱{{ book.retail }}</del>
                  <span class="discount">-{{ book.discount }}%</span>
                </span>
              </p>
            </div>
          </div>

          <div class="add-to-cart" @click="(e) => addToCart(book, e)">
            <el-icon><ShoppingCart /></el-icon>
          </div>
        </el-card>
      </router-link>
    </TransitionGroup>

    <el-pagination
      v-if="props.products.length > pageSize"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="props.products.length"
      size="medium"
      layout="prev, pager, next"
      background
      class="pagination-bar"
    />
  </div>
</template>

<style scoped>
/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.product-page {
  display: flex;
  flex-direction: column;
  height: 1225px;
  justify-content: space-between;
}

.card-container {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.book-link {
  display: flex;
  text-decoration: none;
  color: inherit;
  align-self: stretch;
}

.book-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 200px;
  height: 100%;
  padding: 2px;
  margin: 0 auto;
  border: 1px solid #d6c9bb;
  color: #3b2a22;
  box-shadow: 0 3px 7px rgba(93, 61, 46, 0.08);
  box-sizing: border-box;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
}
.book-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(93, 61, 46, 0.2);
}

.card-info {
  margin-top: auto;
}

.title {
  font-size: 14px;
}
.author {
  display: block;
  color: #999;
  font-size: 13px;
  margin-top: 5px;
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

.add-to-cart {
  position: absolute;
  bottom: 5px;
  right: 12px;
  z-index: 1;
  padding: 5px;
  border-radius: 50%;
  color: #bba68b;
  font-size: 22px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}
.add-to-cart:hover {
  color: #5d3d2e;
  transform: scale(1.1);
}

.tag-container {
  position: absolute;
  top: 15px;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2;
  pointer-events: none;
}
.tag {
  background-color: #f97316;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: fit-content;
}

.pagination-bar {
  margin-top: 0.2rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 1200px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 900px) {
  .card-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
