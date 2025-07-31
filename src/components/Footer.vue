<script setup lang="ts">
import {
  Phone,
  Message,
  Location,
  CreditCard,
  Wallet,
  Money,
  Coin,
} from '@element-plus/icons-vue'
</script>

<template>
  <el-footer class="footer">
    <div class="footer-top">
      <el-row :gutter="20" class="footer-grid" justify="space-between">
        <!-- Logo & Tagline -->
        <el-col :xs="24" :sm="12" :md="6">
          <p class="brand">BOOKTALK</p>
          <p class="tagline">Your daily dose of books and stories</p>

          <!-- Payment Methods -->
          <div class="payment-methods">
            <span>We accept:</span>
            <el-icon><CreditCard /></el-icon>
            <el-icon><Wallet /></el-icon>
            <el-icon><Money /></el-icon>
            <el-icon><Coin /></el-icon>
          </div>
        </el-col>

        <!-- Company Info -->
        <el-col :xs="12" :md="4" class="footer-section">
          <h4 class="section-title">Company</h4>
          <el-link href="#" :underline="false" class="footer-link"
            >About Us</el-link
          ><br />
          <el-link href="#" :underline="false" class="footer-link"
            >Careers</el-link
          ><br />
          <el-link href="#" :underline="false" class="footer-link"
            >Blog</el-link
          >
        </el-col>

        <!-- Service -->
        <el-col :xs="12" :md="4" class="footer-section">
          <h4 class="section-title">Customer Service</h4>
          <el-link href="#" :underline="false" class="footer-link"
            >Help Center</el-link
          >
          <br />
          <el-link href="#" :underline="false" class="footer-link"
            >Shipping</el-link
          ><br />
          <el-link href="#" :underline="false" class="footer-link"
            >Returns</el-link
          >
        </el-col>

        <!-- Contact -->
        <el-col :xs="24" :md="5" class="footer-section">
          <h4 class="section-title">Contact Us</h4>
          <p class="contact-item">
            <el-icon><Phone /></el-icon>
            +63 912 345 6789
          </p>
          <p class="contact-item">
            <el-icon><Message /></el-icon>
            support@booktalk.ph
          </p>
          <p class="contact-item">
            <el-icon><Location /></el-icon>
            Pasig City, PH
          </p>
        </el-col>
      </el-row>
    </div>

    <!-- Bottom -->
    <div class="footer-bottom">
      &copy; {{ new Date().getFullYear() }} BOOKTALK. All rights reserved.
    </div>
  </el-footer>
</template>

<style scoped>
.footer {
  padding: 1.5rem 1rem;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);

  font-family: 'Segoe UI', sans-serif;
  color: #5d3d2e;
  font-size: 0.9rem;
}

.footer-top {
  margin-bottom: 1rem;
}

.footer-grid {
  margin-bottom: 1.2rem;
}

.brand {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.tagline {
  font-size: 0.85rem;
  opacity: 0.75;
  max-width: 250px;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.footer-link {
  color: #5d3d2e;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #a96f49;
}

.contact-item {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  opacity: 0.8;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  opacity: 0.85;
}

.payment-icon {
  font-size: 1.4rem;
  color: #5d3d2e;
}

/* Bottom */
.footer-bottom {
  text-align: center;
  font-size: 0.75rem;
  opacity: 0.65;
  padding-top: 0.8rem;
  padding-bottom: 1rem;
  border-top: 1px solid #eee;
}
</style>
