<script setup lang="ts">
import { useProductStore } from '@/stores/products'
import { onMounted } from 'vue'

const productStore = useProductStore()

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function discounted(book: (typeof productStore.products)[number]) {
  return (book.retail * (1 - book.discount / 100)).toFixed(2)
}
</script>

<template>
  <div class="card-container">
    <el-card v-for="book in productStore.products" :key="book.isbn" class="book-card">
      <template #header>
        <strong>{{ book.title }}</strong>
      </template>

      <p><strong>Author:</strong> {{ book.author }}</p>
      <p><strong>Genre:</strong> {{ book.genre }}</p>
      <p><strong>Published:</strong> {{ formatDate(book.publishDate) }}</p>
      <p>
        <strong>Price: </strong>
        <span v-if="book.discount > 0">
          <del>₱{{ book.retail }}</del>
          <span class="discounted"> ₱{{ discounted(book) }}</span>
        </span>
        <span v-else> ₱{{ book.retail }}</span>
      </p>
    </el-card>
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 1rem;
}

.book-card {
  width: 100%;
  transition: transform 0.2s ease;
}

.book-card:hover {
  transform: scale(1.02);
}

.discounted {
  color: #e53935;
  font-weight: bold;
  margin-left: 0.5rem;
}
</style>
