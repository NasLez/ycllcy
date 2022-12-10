<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  el: '#components-demo',

  data() {
    return {
    }
  },
  computed:{

  },
  methods:{

  }
}
</script>

<style>
#app {
  height: 100%;
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;}
  /*margin-top: 60px;*/
.el-aside::-webkit-scrollbar{display:none;}
page {
  background: #ebecee;
}
</style>
