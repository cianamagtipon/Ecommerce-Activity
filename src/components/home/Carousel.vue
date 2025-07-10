<script setup lang="ts">
const carouselSlides = [
  {
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    title: 'A World of Stories',
    caption: 'Books are uniquely portable magic.',
  },
  {
    image: 'https://www.melaniejadedesign.com/wp-content/uploads/2023/08/cozy-home-12.jpg',
    title: 'Quiet Moments',
    caption: 'Find peace in the pages of a good book.',
  },
  {
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
    title: 'Shelf Goals',
    caption: 'No such thing as buying too many books.',
  },
  {
    image:
      'https://sp-ao.shortpixel.ai/client/to_webp%2Cq_glossy%2Cret_img%2Cw_1024%2Ch_775/https%3A//sociallyrach.com/wp-content/uploads/2025/05/How-to-Create-a-Cozy-Reading-Nook-1024x775.jpg',
    title: 'Late Night Reading',
    caption: 'Sometimes the best stories unfold after midnight.',
  },
]
</script>

<template>
  <div class="carousel-container">
    <div class="block text-center">
      <el-carousel trigger="click" arrow="never" class="carousel">
        <el-carousel-item v-for="(slide, index) in carouselSlides" :key="index">
          <div class="carousel-slide">
            <img :src="slide.image" :alt="slide.title" class="carousel-image" />
            <div class="overlay"></div>
            <div class="carousel-text">
              <h2>{{ slide.title }}</h2>
              <p>{{ slide.caption }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 95%;
  border-radius: 20px; */
  margin: 0 auto;
  background-color: #f5f2ee;
  overflow: hidden;
}

.carousel {
  width: 100vw;
  max-width: 1440px;
  overflow: hidden;
  /* border-radius: 16px; */
  transition: ease;
}

.el-carousel__item,
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  /* filter: blur(3px); */
  object-fit: cover;
  display: block;
}

.carousel-text {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  pointer-events: none;
  color: white;
  padding-top: 4rem;
  padding-bottom: 0.2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  inset: 0;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  font-size: clamp(1.5rem, 3vw, 3rem);
}

.carousel-text h2 {
  margin-bottom: 0.2rem;
}

.carousel-text p {
  margin-top: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 64, 0, 0.2);
  mix-blend-mode: color;
  z-index: 1;
  pointer-events: none;
}

@media (min-width: 1440px) {
  .carousel-container {
    width: 100%;
  }
}
</style>
