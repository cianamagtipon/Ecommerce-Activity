<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useOrderStore } from '@/pinia/orders'
import { useUserStore } from '@/pinia/user'
import type { CollapseModelValue, CollapseActiveName } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

type OrderStatus = 'pending' | 'shipped' | 'delivered'

const userStore = useUserStore()
const orderStore = useOrderStore()

const filterMode = ref<'active' | 'delivered'>('active')
const activeNames = ref<CollapseActiveName[]>([])
const showAllItemsMap = ref<Record<string, boolean>>({})
const timers = ref<Record<string, number>>({})
const intervals = ref<Record<string, ReturnType<typeof setInterval>>>({})

const allOrders = computed(() =>
  userStore.isLoggedIn ? orderStore.getOrdersByUser(userStore.email) : [],
)

const orders = computed(() => {
  if (filterMode.value === 'active') {
    return allOrders.value.filter((o) => o.status !== 'delivered')
  }
  return allOrders.value.filter((o) => o.status === 'delivered')
})

function handleChange(val: CollapseModelValue) {
  activeNames.value = Array.isArray(val) ? val : [val]
}

function toggleShowMore(orderId: string) {
  showAllItemsMap.value[orderId] = !showAllItemsMap.value[orderId]
}

function getStepIndex(status: string) {
  switch (status) {
    case 'pending':
      return 1
    case 'shipped':
      return 2
    case 'delivered':
      return 3
    default:
      return 1
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getCountdownSeconds(status: OrderStatus): number {
  switch (status) {
    case 'pending':
      return 15
    case 'shipped':
      return 30
    default:
      return 0
  }
}

function nextStatus(status: OrderStatus): OrderStatus | null {
  if (status === 'pending') return 'shipped'
  if (status === 'shipped') return 'delivered'
  return null
}

function startCountdown(orderId: string, status: OrderStatus) {
  clearInterval(intervals.value[orderId])
  const remaining = getCountdownSeconds(status)
  if (!remaining || status === 'delivered') return

  timers.value[orderId] = remaining

  intervals.value[orderId] = setInterval(() => {
    timers.value[orderId]--

    if (timers.value[orderId] <= 0) {
      const next = nextStatus(status)
      if (next) {
        orderStore.updateOrderStatus(userStore.email, orderId, next)
        startCountdown(orderId, next)
      } else {
        clearInterval(intervals.value[orderId])
      }
    }
  }, 1000)
}

function changeStatus(orderId: string, val: OrderStatus) {
  orderStore.updateOrderStatus(userStore.email, orderId, val)
  startCountdown(orderId, val)
}

// Start timers on mount
onMounted(() => {
  for (const order of orders.value) {
    if (order.status !== 'delivered') {
      startCountdown(order.id, order.status)
    }
  }
})

// Clear timers on unmount
onUnmounted(() => {
  for (const id in intervals.value) {
    clearInterval(intervals.value[id])
  }
})
</script>

<template>
  <div class="order-container">
    <h2 class="order-heading">Your Orders</h2>

    <!-- Tabs -->
    <el-breadcrumb :separator-icon="ArrowRight" class="order-toggle">
      <el-breadcrumb-item>
        <span
          :class="{ 'active-tab': filterMode === 'active' }"
          @click="filterMode = 'active'"
        >
          Active Orders
        </span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span
          :class="{ 'active-tab': filterMode === 'delivered' }"
          @click="filterMode = 'delivered'"
        >
          Order History
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-collapse v-model="activeNames" @change="handleChange" accordion>
      <el-collapse-item
        v-for="order in orders"
        :key="order.id"
        :title="
          filterMode === 'delivered'
            ? `Order Delivered: ${new Date(order.date).toLocaleString()}`
            : `Order Placed: ${new Date(order.date).toLocaleString()}`
        "
        :name="order.id"
      >
        <div class="order-card">
          <!-- Order Header -->
          <div class="order-header">
            <span>
              Total: <strong>₱{{ order.total.toFixed(2) }}</strong>
            </span>

            <p
              v-if="
                order.status !== 'delivered' && timers[order.id] !== undefined
              "
              class="countdown-timer"
            >
              <template v-if="order.status === 'pending'">
                For Shipping ({{ formatTime(timers[order.id]) }})
              </template>
              <template v-else-if="order.status === 'shipped'">
                Under Delivery ({{ formatTime(timers[order.id]) }})
              </template>
            </p>

            <el-select
              v-model="order.status"
              placeholder="Status"
              size="small"
              class="status-select"
              @change="(val: OrderStatus) => changeStatus(order.id, val)"
              :disabled="filterMode === 'delivered'"
            >
              <el-option label="Pending" value="pending" />
              <el-option label="Shipped" value="shipped" />
              <el-option label="Delivered" value="delivered" />
            </el-select>
          </div>

          <!-- Item List -->
          <div class="item-list">
            <div
              v-for="(item, index) in showAllItemsMap[order.id]
                ? order.items
                : order.items.slice(0, 3)"
              :key="item.isbn"
              class="item-row"
            >
              <div class="item-details">
                <p class="item-title">{{ item.title }}</p>
                <p class="item-qty">Qty: {{ item.quantity }}</p>
              </div>
              <p class="item-price">
                ₱{{ (item.price * item.quantity).toFixed(2) }}
              </p>
            </div>
            <button
              v-if="order.items.length > 3"
              class="show-more-btn"
              @click="toggleShowMore(order.id)"
            >
              {{ showAllItemsMap[order.id] ? 'Show less' : 'Show more' }}
            </button>
          </div>

          <!-- Order Status Stepper -->
          <el-steps
            :active="getStepIndex(order.status)"
            finish-status="success"
            align-center
            simple
            class="status-steps"
          >
            <el-step title="Pending" />
            <el-step title="Shipped" />
            <el-step title="Delivered" />
          </el-steps>
        </div>
      </el-collapse-item>
    </el-collapse>

    <p v-if="!orders.length" class="no-orders">
      {{
        filterMode === 'active'
          ? "You don't have any active orders."
          : 'No order history yet.'
      }}
    </p>
  </div>
</template>

<style scoped>
.order-container {
  margin: 0 auto;
}

.order-heading {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #5d3d2e;
}

.order-toggle {
  justify-content: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.order-toggle span {
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
}

.order-toggle span:hover {
  color: #5d3d2e;
}

.order-toggle .active-tab {
  color: #5d3d2e;
  font-weight: 600;
}

.order-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.95rem;
  color: #333;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.countdown-timer {
  font-size: 14px;
  color: #999;
}

.status-select {
  width: 8rem;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
}

.item-details {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-weight: 500;
}

.item-qty {
  font-size: 0.75rem;
  color: #666;
}

.item-price {
  font-weight: 600;
}

.status-steps {
  margin-top: 0.5rem;
}

.no-orders {
  text-align: center;
  color: #888;
  margin-top: 2rem;
}

.show-more-btn {
  background: none;
  border: none;
  color: #888;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  margin-top: 0.25rem;
  align-self: center;
  padding: 0;
}

.show-more-btn:hover {
  color: #5d3d2e;
}
</style>
