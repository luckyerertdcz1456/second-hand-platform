<template>
  <div id="app">
<!-- <login></login> -->
   <!--  <home></home> -->
   <router-view></router-view>
  </div>

</template>
<script>
import login from '../src/views/login.vue'
import home from '../src/views/home.vue'
export default {
  components: { login,home }
}
</script>
<style></style>
