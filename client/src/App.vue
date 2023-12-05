<template>
  <component :is="layout"></component>
</template>

<script>
import MainPage from '@/components/MainPage.vue';
import { useStructure } from '@/stores/list';

import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { fetchDataFromFirebase, fetchDataFromMongo } from '@/plugins/auth';

export default {
  components: {
    MainPage
  },
  data() {
    return {
      user: null,
      loading: true
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      useStructure().onAuthStateChanged(auth.currentUser);
      if (user) {
        // Пользователь аутентифицирован
        this.loading = true;
        fetchDataFromMongo(user.uid)
        .then(() => {
          this.user = user.uid; this.loading = false;
        }).catch( () => { this.loading = false; } )
        
      } else {
        // Пользователь не аутентифицирован
        this.user = null; this.loading = false;
      }
    })
  },
  computed: {
    layout() {
      if (this.loading) return 'loading'
      if(this.user) {
        return 'main-page'
      } else return 'login'
    }
  }
}
</script>


