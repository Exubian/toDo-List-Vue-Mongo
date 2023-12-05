import MainPage from '@/components/MainPage.vue';
import Login from '@/components/Login.vue'

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: MainPage
  },
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL)
})

export default router;