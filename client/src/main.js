import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'materialize-css/dist/js/materialize.min'
import './style.css';
import '/src/plugins/functions.js'
import App from './App.vue';
import components from '@/components/glob'
import dateFilter from '@/filters/dateFilter'

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '/src/plugins/firebase.js'


const fb = initializeApp(
  firebaseConfig
);
const auth = getAuth(fb);

const pinia = createPinia();
let app = createApp(App);
app.use(pinia);
components.forEach(compon => {
  app.component(compon.name, compon)
});
app.config.globalProperties.$auth = auth;
app.config.globalProperties.$filters = {dateFilter};
app.mount('#app');

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Veryfied") //, user
  } else {
    console.log("Signed out")
  }
})




