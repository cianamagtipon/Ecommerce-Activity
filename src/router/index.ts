import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/views/HomeView.vue'
import Register from '@/components/auth/Register.vue'
import Profile from '@/components/Profile.vue'
import StoreView from '@/components/views/StoreView.vue'
import ProductView from '@/components/views/ProductView.vue'
import CartView from '@/components/views/CartView.vue'
import CheckoutView from '@/components/views/CheckoutView.vue'
import ErrorView from '@/components/views/ErrorView.vue'
import User from '@/components/profile/User.vue'
import Orders from '@/components/profile/Orders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/registration',
      name: 'register',
      component: Register,
    },

    {
      path: '/profile',
      component: Profile,
      children: [
        {
          path: '',
          redirect: '/profile/user',
        },
        {
          path: 'user',
          name: 'user',
          component: User,
        },
        {
          path: 'orders',
          name: 'orders',
          component: Orders,
        },
      ],
    },
    {
      path: '/store',
      name: 'store',
      component: StoreView,
    },
    {
      path: '/store/:genre',
      name: 'genre',
      component: StoreView,
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
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/pagenotfound',
      name: 'error',
      component: ErrorView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'error' },
    },
  ],
})

export default router
