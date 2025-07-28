<script setup lang="ts">
import User from './profile/User.vue'
import Orders from './profile/Orders.vue'
</script>

<template>
  <div class="profile-container">
    <div class="profile-view">
      <User />
    </div>

    <div class="orders">
      <Orders />
    </div>
  </div>
</template>
