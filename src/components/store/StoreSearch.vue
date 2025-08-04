<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElAutocomplete } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useProductStore } from '@/pinia/products'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()

const searchText = ref((route.query.q as string) || '')

// Navigate to current page with ?q=searchText
function applySearch() {
  const trimmed = searchText.value.trim()
  if (trimmed) {
    router.push({
      path: route.path,
      query: { ...route.query, q: trimmed },
    })
  } else {
    const { q, ...rest } = route.query
    router.push({ path: route.path, query: rest })
  }
}

// Trigger search on select or Enter
function onSelectSuggestion(item: Record<string, any>) {
  searchText.value = item.value
  applySearch()
}

// Fetch suggestions dynamically
function fetchSuggestions(
  queryString: string,
  cb: (results: { value: string }[]) => void,
) {
  const query = queryString.toLowerCase().trim()

  const suggestionsSet = new Set<string>()

  for (const p of productStore.products) {
    const titleMatch = p.title.toLowerCase().includes(query)
    const authorMatch = p.author.toLowerCase().includes(query)

    if (!query || titleMatch) {
      suggestionsSet.add(p.title)
    }
    if (!query || authorMatch) {
      suggestionsSet.add(p.author)
    }
  }

  // Convert to array
  let suggestions = Array.from(suggestionsSet).map((v) => ({ value: v }))

  // 10 limit when search is clicked empty
  if (!query) {
    suggestions = suggestions.slice(0, 10)
  }

  cb(suggestions)
}
</script>

<template>
  <el-autocomplete
    v-model="searchText"
    :fetch-suggestions="fetchSuggestions"
    placeholder="Search by title or author"
    class="search-input"
    clearable
    :trigger-on-focus="true"
    @select="onSelectSuggestion"
    @clear="applySearch"
    @keyup.enter.native="applySearch"
  >
    <template #prefix>
      <el-icon><Search /></el-icon>
    </template>
  </el-autocomplete>
</template>

<style scoped>
.search-input {
  width: 100%;
}

:deep(.el-input__inner) {
  padding-left: 32px !important;
  font-size: 15px;
  color: #5d3d2e;
  background-color: var(--el-input-bg-color);
  border: 1px solid #e8d9cc;
  border-radius: 8px;
}

:deep(.el-input__prefix) {
  color: #a78d7b;
  left: 0.75rem;
}

:deep(.el-input.is-focus .el-input__inner) {
  box-shadow: 0 0 0 2px #e8d9cc;
}

:deep(.el-autocomplete-suggestion li) {
  color: #5d3d2e;
  padding: 8px 12px;
}

:deep(.el-autocomplete-suggestion li:hover) {
  background-color: #f8f1ea;
}
</style>
