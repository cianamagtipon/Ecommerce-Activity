<script setup lang="ts">
const carouselSlides = [
  {
    image: 'https://byanavrin.com/cdn/shop/articles/1A-151763.png',
    title: 'A World of Stories',
    caption: 'Books are uniquely portable magic.',
  },
  {
    image:
      'https://cdn11.bigcommerce.com/s-pqt7n8/images/stencil/1280x1280/products/12999/42026/robotime-diy-miniature-booknook-wonderland-bookstore2__65110.1703800064.jpg?c=2?imbypass=on',
    title: 'Quiet Moments',
    caption: 'Find peace in the pages of a good book.',
  },
  {
    image:
      'https://www.robotimeonline.com/cdn/shop/articles/1_394678ce-2aa3-4dd6-a479-0fe303096094.jpg',
    title: 'Shelf Goals',
    caption: 'No such thing as buying too many books.',
  },
  {
    image:
      'https://magicholz.de/cdn/shop/files/GrimmsBuilding_Diorama_BookNook_MagicHolz5.png',
    title: 'Late Night Reading',
    caption: 'Sometimes the best stories unfold after midnight.',
  },
]
</script>

<template>
  <div class="carousel-container">
    <div class="block text-center">
      <el-carousel trigger="click" class="carousel">
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
  border-radius: 8px;
  max-width: 1440px;
  margin: 0 auto;
  box-shadow: 0 8px 16px rgba(93, 61, 46, 0.5);
}

.carousel {
  width: 98vw;
  height: 50vh;
  max-width: 1440px;
  overflow: hidden;
  border-radius: 8px;
  transition: ease;
}

.el-carousel__item,
.carousel-image {
  width: 100%;
  height: 50vh;
  object-fit: cover;
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 50vh;
}

.carousel-image {
  width: 100%;
  height: 50vh;
  /* filter: blur(3px); */
  object-fit: cover;
  display: block;
}

.carousel-text {
  height: 50vh;
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
  font-size: clamp(1.2rem, 4vw, 2.5rem);
  text-shadow: 0 5px 4px rgba(0, 0, 0, 0.6);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
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

@media (min-width: 1000px) and (max-height: 700px) {
  .carousel {
    width: 95vw;
  }

  .el-carousel__item,
  .carousel-image {
    height: 50vh;
  }

  .carousel-text {
    height: 30vh;
  }
}

@media (min-width: 1440px) {
  .carousel-container {
    width: 100%;
  }

  .carousel {
    height: 35vh;
  }

  .el-carousel__item,
  .carousel-image {
    height: 50vh;
  }

  .carousel-text {
    height: 35vh;
  }
}

@media (max-height: 899px) {
  .carousel {
    height: 50vh;
  }

  .carousel-image,
  .carousel-slide {
    height: 50vh;
  }

  .carousel-text {
    height: 45vh;
  }
}

@media (max-width: 900px) {
  .carousel-container {
    margin: 1rem auto;
  }

  .carousel {
    width: 95vw;
    height: 40vh;
  }

  .el-carousel__item,
  .carousel-image {
    height: 40vh;
  }

  .carousel-text {
    height: 35vh;
  }
}

@media (max-width: 600px) {
  .carousel-container {
    margin: 1rem auto;
  }

  .carousel {
    width: 90vw;
    height: 30vh;
  }

  .el-carousel__item,
  .carousel-image {
    height: 30vh;
  }

  .carousel-text {
    height: 15vh;
  }
}
</style>
