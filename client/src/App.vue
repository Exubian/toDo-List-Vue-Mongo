<template>
  <component :is="layout">
    <router-view/>
  </component>
</template>

<script>
import MainPage from '@/components/MainPage.vue';

import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useAuth } from '@/stores/auth';

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
      if (user) {
        this.loading = true;
        useAuth().fetchDataFromMongo(user.uid)
        .then(() => {
          this.user = user.uid; this.loading = false;
        }).catch( () => { this.loading = false; } )
        
      } else {
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


