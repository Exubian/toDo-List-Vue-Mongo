<template>
  <div class="app-loading" :class="{free : type=='free'}">
    <div class="preloader-wrapper big active" v-if="type == 'free'">
      <div class="spinner-layer spinner-green-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>

    <div class="preloader-wrapper active" v-if="type == 'in'">
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
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


  /* @import '/node_modules/materialize-css/dist/css/materialize.min.css'; */

</style>