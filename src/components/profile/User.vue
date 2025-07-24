<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/pinia/user'
import { ElMessage } from 'element-plus'
import { User, Iphone, Location, Message } from '@element-plus/icons-vue'

const userStore = useUserStore()
const isEditing = ref(false)

const editableForm = ref({
  name: userStore.name,
  email: userStore.email,
  phone: userStore.phone,
  address: userStore.address,
})

function toggleEdit() {
  if (isEditing.value) {
    userStore.name = editableForm.value.name
    userStore.email = editableForm.value.email
    userStore.phone = editableForm.value.phone
    userStore.address = editableForm.value.address
    ElMessage.success('Profile updated')
  } else {
    editableForm.value = {
      name: userStore.name,
      email: userStore.email,
      phone: userStore.phone,
      address: userStore.address,
    }
  }

  isEditing.value = !isEditing.value
}
</script>

<template>
  <div class="profile-container">
    <div class="user-profile">
      <span class="title">User Profile</span>
      <el-button type="primary" @click="toggleEdit">
        {{ isEditing ? 'Save' : 'Edit' }}
      </el-button>
    </div>

    <div class="description-columns">
      <!-- Left Column -->
      <el-descriptions :column="1" direction="vertical">
        <el-descriptions-item label="Name">
          <template #label>
            <div class="cell-item">
              <el-icon><User /></el-icon>
              Name
            </div>
          </template>
          <template v-if="isEditing">
            <el-input v-model="editableForm.name" />
          </template>
          <template v-else>
            {{ editableForm.name || 'N/A' }}
          </template>
        </el-descriptions-item>

        <el-descriptions-item label="Address">
          <template #label>
            <div class="cell-item">
              <el-icon><Location /></el-icon>
              Address
            </div>
          </template>
          <template v-if="isEditing">
            <el-input v-model="editableForm.address" />
          </template>
          <template v-else>
            <div class="wrapped-text">
              {{ editableForm.address || 'N/A' }}
            </div>
          </template>
        </el-descriptions-item>
      </el-descriptions>

      <!-- Right Column -->
      <el-descriptions :column="1" direction="vertical">
        <el-descriptions-item label="Email">
          <template #label>
            <div class="cell-item">
              <el-icon><Message /></el-icon>
              Email
            </div>
          </template>
          <template v-if="isEditing">
            <el-input v-model="editableForm.email" />
          </template>
          <template v-else>
            {{ editableForm.email || 'N/A' }}
          </template>
        </el-descriptions-item>

        <el-descriptions-item label="Phone">
          <template #label>
            <div class="cell-item">
              <el-icon><Iphone /></el-icon>
              Phone
            </div>
          </template>
          <template v-if="isEditing">
            <el-input v-model="editableForm.phone" />
          </template>
          <template v-else>
            {{ editableForm.phone || 'N/A' }}
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  width: 85vw;
  margin: 2rem auto;
}

.description-columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  gap: 40px;
}

.user-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.description-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.cell-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  line-height: 1.2;
}

.wrapped-text {
  word-break: break-word;
  white-space: pre-line;
}

.description-columns ::v-deep(.el-descriptions) {
  flex: 1;
  min-width: 300px;
}

.description-columns ::v-deep(.el-descriptions__label),
.description-columns ::v-deep(.el-descriptions__content) {
  vertical-align: top;
}
</style>
