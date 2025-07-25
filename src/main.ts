import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { useUserStore } from '@/pinia/user'
import { useCartStore } from '@/pinia/cart'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// load stores before app mount
const userStore = useUserStore()
const cartStore = useCartStore()

userStore.loadUserFromStorage()
cartStore.loadCartFromStorage()

app.mount('#app')
