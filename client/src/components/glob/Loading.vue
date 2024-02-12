<template>
  <div class="app-loading" :class="{free : type=='free'}">
    <div class="spinner-border text-success" v-if="type=='free'"
      style="width: 5rem; height: 5rem;" role="status"
      >
      <span class="visually-hidden">Loading...</span>
    </div>

    <div class="preloader-wrapper active" v-if="type == 'in'">
      <span role="status">Загрузка...</span>
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    </div>

  </div>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    type: {
      type: String,
      default: 'free'
    }
  }
}
</script>
<style scoped>
.app-loading {
  display: flex;
  width: 100%;
  justify-content: center;
}
.free {
  padding-top: 3rem;
}


</style>