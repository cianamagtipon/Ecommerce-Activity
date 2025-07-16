<template>
  <el-footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <p class="brand">BOOKTALK</p>
      </div>
      <div class="footer-right">
        <a href="#" class="footer-link">About</a>
        <a href="#" class="footer-link">Privacy</a>
        <a href="#" class="footer-link">Contact</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>
        &copy; {{ new Date().getFullYear() }} BOOKTALK. All rights reserved.
      </p>
    </div>
  </el-footer>
</template>

<style scoped>
.footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e5e5;
  color: #5d3d2e;
  font-family: 'Segoe UI', sans-serif;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.footer-left {
  max-width: 60%;
}

.brand {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.tagline {
  font-size: 0.9rem;
  opacity: 0.8;
}

.footer-right {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.footer-link {
  color: #5d3d2e;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #a96f49;
}

.footer-bottom {
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>
