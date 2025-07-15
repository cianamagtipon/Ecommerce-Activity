<script setup></script>
<template>
  <div class="header-container">
    <div class="top-header">
      <span class="logo">BOOKTALK</span>

      <div class="right">
        <el-button class="login-button" round>Log in</el-button>
        <el-button class="signup-button" round>Sign up for free</el-button>
      </div>
    </div>

    <el-divider class="tagline" content-position="left">
      <em>Where Stories Spark Conversations</em>
    </el-divider>
  </div>
</template>

<style scoped>
.header-container {
  margin-bottom: 0.25rem;
}

.top-header {
  /* border-bottom: 0.2px solid #ddd; */
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 30px;
  font-weight: 600;
  margin-top: 5px;
  color: #5d3d2e;
}

.right a {
  margin-left: 1rem;
  color: #666;
  text-decoration: none;
}

.right a:hover {
  text-decoration: underline;
}

.signup-button {
  color: white;
  background-color: #5d3d2e;
  border: none;
}

.login-button {
  border-color: #5d3d2e;
  color: #5d3d2e;
}

.tagline {
  color: #5d3d2e;
}

::v-deep(.el-divider) {
  border-top: 1px solid rgba(93, 61, 46, 0.3);
  margin-top: 0.25rem;
  margin-bottom: 1rem;
}

::v-deep(.el-divider__text) {
  color: #5d3d2e;
  background-color: white;
  padding: 0 8px;
}

@media (max-width: 600px) {
  .right {
    display: none;
  }
}
</style>
