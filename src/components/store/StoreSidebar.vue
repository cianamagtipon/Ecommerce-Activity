<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Genre } from '@/types/product'

const router = useRouter()
const route = useRoute()

const genres: (Genre | 'All')[] = [
  'All',
  'Fiction',
  'Nonfiction',
  'Romance',
  'Mystery',
  'Thriller',
  'Fantasy',
  'Science Fiction',
  'Historical',
  'Young Adult',
  'Children',
  'Biography',
  'Memoir',
  'Self-Help',
  'Health & Wellness',
  'Business',
  'Poetry',
  'Comics & Graphic Novels',
  'Religion & Spirituality',
  'Cookbooks',
  'Education',
  'Travel',
  'Art & Photography',
  'Classic',
]

const currentGenre = computed(() => {
  return (route.params.genre as string) || 'All'
})

function navigateToGenre(genre: string) {
  if (genre === 'All') {
    router.push('/store')
  } else {
    router.push(`/store/${encodeURIComponent(genre)}`)
  }
}
</script>

<template>
  <div class="store-sidebar">
    <div class="filter-tabs">
      <div
        v-for="genre in genres"
        :key="genre"
        class="filter-tab"
        :class="{ active: currentGenre === genre }"
        @click="navigateToGenre(genre)"
      >
        {{ genre }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-sidebar {
  width: 240px;
  height: 100%;
  overflow-y: auto;
  margin-right: 1rem;
  margin-top: 0.5rem;
}

.search-input {
  width: 100%;
}

.filter-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-tab {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #5d3d2e;
  transition: background-color 0.2s;
  white-space: normal;
  word-break: break-word;
  max-width: 100%;
  box-sizing: border-box;
}

.filter-tab:hover {
  background-color: #eee4db;
}

.filter-tab.active {
  background-color: #5d3d2e;
  color: white;
}

:deep(.search-input) {
  margin-bottom: 0.5rem;
}

:deep(.el-input__inner) {
  padding-left: 10px !important; /* space for icon */
  font-size: 15px;
  color: #5d3d2e;
  background-color: var(--el-input-bg-color);
}

:deep(.el-input.is-focus .el-input__inner) {
  box-shadow: 0 0 0 2px #e8d9cc;
}

:deep(.el-input__prefix) {
  color: #a78d7b;
  left: 0.75rem;
}
</style>
