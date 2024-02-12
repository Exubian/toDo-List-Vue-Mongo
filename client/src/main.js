import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import '@popperjs/core/dist/esm/'
import './style.css';
import '/src/plugins/functions.js'
import App from './App.vue';
import components from '@/components/glob'
import router from '@/router/router'
import dateFilter from '@/filters/dateFilter'

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '/src/plugins/firebase.js'


const fb = initializeApp(
  firebaseConfig
);
const auth = getAuth(fb);

let app;

onAuthStateChanged(auth, (user) => {
  if (!app) {
    const pinia = createPinia();
    app = createApp(App);
    app.use(pinia);
    app.use(router)
    components.forEach(compon => {
      app.component(compon.name, compon)
    });
    app.config.globalProperties.$auth = auth;
    app.config.globalProperties.$filters = {dateFilter};
    app.mount('#app');
  }
  (user) ? console.log("Veryfied") : console.log("Signed out") //, user
})
