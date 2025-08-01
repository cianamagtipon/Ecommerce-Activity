<script setup lang="ts">
import StoreSearch from './store/StoreSearch.vue'
import { useProductStore } from '@/pinia/products'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import StoreCards from './store/StoreCards.vue'
import StoreSidebar from './store/StoreSidebar.vue'

import type { Genre } from '@/types/product'

const productStore = useProductStore()
const route = useRoute()

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})

// Get genre from route (optional param)
const genre = computed(() => route.params.genre as Genre | undefined)

// Add after genre
const searchQuery = computed(() =>
  ((route.query.q as string) || '').toLowerCase(),
)

// Use search query if present, otherwise fall back to genre
const filteredProducts = computed(() => {
  const products = productStore.products

  if (searchQuery.value) {
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.value) ||
        p.author.toLowerCase().includes(searchQuery.value),
    )
  }

  if (!genre.value || genre.value.toLowerCase() === 'all') {
    return products
  }

  return products.filter(
    (p) => p.genre.toLowerCase() === genre.value?.toLowerCase(),
  )
})
</script>

<template>
  <div class="store-layout">
    <div class="sidebar-container">
      <StoreSearch />
      <StoreSidebar />
    </div>

    <!-- Main content -->
    <div class="main-content">
      <transition name="fade" mode="out-in" appear>
        <div :key="genre + searchQuery">
          <h2 v-if="searchQuery">Results for "{{ searchQuery }}"</h2>
          <h2 v-else-if="genre">{{ genre }} books</h2>
          <StoreCards :products="filteredProducts" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.store-layout {
  display: flex;
  align-items: flex-start;
}

.sidebar-container {
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-right: 1.5rem;
  margin-top: 1rem;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-right: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
