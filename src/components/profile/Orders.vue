<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '@/pinia/orders'
import type { OrderItem } from '@/types/order'
import { useUserStore } from '@/pinia/user'

const userStore = useUserStore()
const orderStore = useOrderStore()
const orders = computed(() =>
  userStore.isLoggedIn ? orderStore.orders[userStore.name] || [] : [],
)
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Your Orders</h2>

    <div v-if="orders.length">
      <el-card v-for="order in orders" :key="order.id" class="mb-4">
        <div>
          <strong>Date:</strong>
          {{ new Date(order.date).toLocaleString() }}
        </div>
        <div>
          <strong>Total:</strong>
          ₱{{ order.total.toFixed(2) }}
        </div>

        <el-table :data="order.items" size="small" style="width: 100%" border>
          <el-table-column prop="title" label="Title" />
          <el-table-column prop="quantity" label="Qty" width="80" />
          <el-table-column
            label="Subtotal"
            width="120"
            :formatter="
              (_: unknown, __: unknown, row: OrderItem) =>
                `₱${(row.price * row.quantity).toFixed(2)}`
            "
          />
        </el-table>
      </el-card>
    </div>

    <p v-else>No orders yet.</p>
  </div>
</template>
