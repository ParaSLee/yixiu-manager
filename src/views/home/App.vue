<template>
  <div>
    <manageNav></manageNav>

    <div class="contain-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  //vant
  import manageNav from "./components/manageNav";
  export default {
    components: {
      manageNav,
    },
    methods: {
     
    }
  }
</script>

<style scoped>
  .contain-right{
    position: absolute;
    height: 98%;
    margin-left: 288px;
    background: #fff;
    /*min-height: 100%;*/
    padding: 53px 68px;
    margin-top: 13px;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
    overflow-y: auto;
    /*overflow-x: hidden;*/
    z-index: 100;
    min-width:100%;
    box-sizing:border-box;
    border-right: 288px solid transparent;
  }
</style>