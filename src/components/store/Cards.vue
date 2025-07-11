<script setup lang="ts">
import { useProductStore } from '@/stores/products'
import { onMounted } from 'vue'

const productStore = useProductStore()

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})

// function formatDate(date: Date): string {
//   return new Date(date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   })
// }

function discounted(book: (typeof productStore.products)[number]) {
  return (book.retail * (1 - book.discount / 100)).toFixed(2)
}
</script>

<template>
  <div class="card-container">
    <el-card
      v-for="book in productStore.products"
      :key="book.isbn"
      class="book-card"
    >
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
        style="width: 100%"
      />

      <div class="card-info">
        <div class="book-info">
          <p>
            <span class="title">
              <strong>
                {{ book.title }}
              </strong> </span
            ><br />
            <span class="author">
              {{ book.author }}
            </span>
          </p>
        </div>

        <!-- Main price display -->
        <div class="book-price">
          <p>
            <span v-if="book.discount > 0" class="discounted">
              ₱{{ discounted(book) }}
            </span>
            <span v-else
              ><strong>₱{{ book.retail }}</strong></span
            ><br />

            <!-- Original price and discount under the main price -->
            <span v-if="book.discount > 0" class="under-retail">
              <del>₱{{ book.retail }}</del>
              <span class="discount">-{{ book.discount }}%</span>
            </span>
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.book-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  min-height: 260px;
  padding: 2px;
  margin: 0 auto;
  border: 1px solid #d6c9bb;
  color: #3b2a22;
  box-shadow: 0 3px 7px rgba(93, 61, 46, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.book-card img {
  width: 100%;
  object-fit: cover;
  height: auto;
}

.card-info {
  margin-top: auto;
}

.book-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(93, 61, 46, 0.2);
}

.book-card strong {
  color: #5d3d2e;
}

.title {
  font-size: 14px;
}

.author {
  display: block; /* makes margin-top work for some reason */
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

@media (max-width: 600px) {
  .card-container {
    grid-template-columns: 1fr;
  }
}
</style>
