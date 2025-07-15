<script setup lang="ts">
import Product from '../Product.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
</script>

<template>
  <div class="product">
    <Product :id="id" />
  </div>
</template>
