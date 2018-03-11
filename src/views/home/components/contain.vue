<template>
  <div class="contain-right">
    <router-view></router-view>
  </div>
</template>

<script>
  //vant
  export default {
    data(){
      return {

      }
    },
    components: {
      
    },
    methods: {
    }
  }
</script>

<style scoped>
  .contain-right{
    position: absolute;
    width: 100%;
    height: 100%;
    margin-left: 288px;
    background: #fff;
    min-height: 100%;
    padding: 53px 68px;
    margin-top: 13px;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 100;
  }
</style>