import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/views/HomeView.vue'

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
      component: () => import('../components/views/StoreView.vue'),
    },
    {
      path: '/pagenotfound',
      name: 'error',
      component: () => import('../components/views/ErrorView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'error' }, // Catch-all route
    },
  ],
})

export default router
