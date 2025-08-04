<script setup lang="ts">
import StoreSearch from './store/StoreSearch.vue'
import StoreSidebar from './store/StoreSidebar.vue'
import StoreCards from './store/StoreCards.vue'

import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElDrawer } from 'element-plus'
import type { Genre } from '@/types/product'

import { useProductTags } from '@/composables/productTags'
import { useProductStore } from '@/pinia/products'

const { isNewArrival, isBestSeller } = useProductTags()

const productStore = useProductStore()
const route = useRoute()

const drawerVisible = ref(false)

type ExtendedGenre = Genre | 'Best Sellers' | 'New Arrivals' | 'All'

const genre = computed(() => route.params.genre as ExtendedGenre | undefined)

const searchQuery = computed(() =>
  ((route.query.q as string) || '').toLowerCase(),
)

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

  if (genre.value === 'Best Sellers') {
    return products.filter(isBestSeller)
  }

  if (genre.value === 'New Arrivals') {
    return products.filter(isNewArrival)
  }

  return products.filter(
    (p) => p.genre.toLowerCase() === genre.value?.toLowerCase(),
  )
})

function scrollToGrid() {
  const grid = document.querySelector('.product-grid')
  grid?.scrollIntoView({ behavior: 'smooth' })
}

watch(() => route.params.genre, scrollToGrid)
watch(() => route.query.q, scrollToGrid)

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.loadMockData()
  }
})
</script>

<template>
  <div class="store-layout">
    <!-- Drawer toggle button (mobile only) -->
    <button class="drawer-toggle" @click="drawerVisible = true">
      Filters & Search
    </button>

    <!-- Sidebar shown on desktop only -->
    <div class="sidebar-container desktop-only">
      <StoreSearch />
      <StoreSidebar />
    </div>

    <!-- Drawer on mobile -->
    <el-drawer
      v-model="drawerVisible"
      direction="ltr"
      size="80%"
      :with-header="false"
      class="mobile-drawer"
    >
      <div class="sidebar-container">
        <StoreSearch />
        <StoreSidebar />
      </div>
    </el-drawer>

    <!-- Main product area -->
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
  flex-wrap: wrap;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.sidebar-container {
  width: 220px;
  min-width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-right: 1rem;
}

/* Drawer toggle button (mobile only) */
.drawer-toggle {
  display: none;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background-color: #5d3d2e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

/* MOBILE STYLES */
@media (max-width: 768px) {
  .store-layout {
    flex-direction: column;
    max-width: 100%;
  }

  .drawer-toggle {
    display: inline-block;
    align-self: flex-start;
    margin-left: 1rem;
  }

  .sidebar-container.desktop-only {
    display: none;
  }

  .main-content {
    padding: 0 1rem;
  }
}
</style>
