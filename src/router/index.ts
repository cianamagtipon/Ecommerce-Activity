import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/views/HomeView.vue'
import StoreView from '../components/views/StoreView.vue'
import ProductView from '@/components/views/ProductView.vue'
import CartView from '@/components/views/CartView.vue'
import ErrorView from '../components/views/ErrorView.vue'
import GenreView from '@/components/views/GenreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/home',
      redirect: '/',
    },
    {
      path: '/store',
      name: 'store',
      component: StoreView,
    },
    {
      path: '/store/:genre',
      name: 'genre',
      component: GenreView,
    },
    {
      path: '/store/:genre/:id',
      name: 'product',
      component: ProductView,
      props: true,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/pagenotfound',
      name: 'error',
      component: ErrorView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'error' }, // Catch-all route
    },
  ],
})

export default router
