<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goTo(destination: string) {
  if (destination === 'bestsellers') {
    router.push('/store/Best%20Sellers')
  } else if (destination === 'new') {
    router.push('/store/New%20Arrivals')
  } else {
    router.push('/store')
  }
}
</script>

<template>
  <section class="home-section">
    <div class="image-container">
      <div class="feature-item" @click="goTo('bestsellers')">
        <img
          src="https://images.pexels.com/photos/8666735/pexels-photo-8666735.jpeg"
          class="clickable-img"
        />
        <p class="feature-label">Top Picks of the Month</p>
        <p class="feature-description">
          Discover the most loved books by our readers this month! Curated
          selections that are trending for all the right reasons, from
          page-turning thrillers to heartwarming tales.
        </p>
      </div>

      <div class="feature-item" @click="goTo('new')">
        <img
          src="https://images.pexels.com/photos/8164393/pexels-photo-8164393.jpeg"
          class="clickable-img"
        />
        <p class="feature-label">Fresh From the Shelf</p>
        <p class="feature-description">
          Explore the newest arrivals, hot off the press! Stay ahead of the
          curve with fresh titles and hidden gems that everyone will be talking
          about soon.
        </p>
      </div>

      <div class="feature-item" @click="goTo('store')">
        <img
          src="https://images.pexels.com/photos/5095897/pexels-photo-5095897.jpeg"
          class="clickable-img"
        />
        <p class="feature-label">Start Your Reading Journey</p>
        <p class="feature-description">
          Not sure what to read next? Browse across genres, dive into our
          recommendations, and find your next unforgettable read. Perfect for
          any mood or moment!
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-section {
  margin-top: 3rem;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(2rem, 13vw, 17rem);
  padding: 0 1rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.3s ease;
}

.feature-label {
  margin-top: 2rem;
  font-weight: 600;
  font-size: 1rem;
  color: #5d3d2e;
  max-width: 200px;
}

.feature-description {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #a88771;
  max-width: 240px;
  line-height: 1.6;
}

.clickable-img {
  width: clamp(150px, 13vw, 180px);
  height: clamp(150px, 13vw, 180px);
  object-fit: cover;
  border-radius: 50%;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.feature-item:hover .clickable-img {
  transform: scale(1.05);
}
</style>
