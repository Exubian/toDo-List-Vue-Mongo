import MainPage from '@/components/MainPage.vue';
import Login from '@/components/glob/Login.vue';
import Settings from '@/components/glob/Settings.vue';
import { getAuth } from 'firebase/auth';

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {path: '/', redirect: '/todos' },
  {
    path: '/todos',
    name:'todos',
    meta: {auth: true},
    component: MainPage,
    // component: () => import('/path/to/component')
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {auth: true},
    component: Settings
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
})

router.beforeEach( (to, from, next) => {
  const user = getAuth().currentUser;
  const requireAuth = to.matched.some(route => route.meta.auth);
  
    console.log('VRt', user)
    if (requireAuth && !user) {
      next('/login?message=login');
    } else {
      next();
    }
  
});


export default router;