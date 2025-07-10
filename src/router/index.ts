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
      path: '/about',
      name: 'about',
      component: () => import('../components/views/AboutView.vue'),
    },
  ],
})

export default router
