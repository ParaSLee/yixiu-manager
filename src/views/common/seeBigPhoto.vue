<template>
  <div class="imgBox" @click="closeImg">
    <img :src="imgurl" alt="">
  </div>
</template>

<script>

  export default {
    props:{
      imgurl:String,
    },
    methods: {
     closeImg(){
      this.$emit("closeimg")
     }
    }
  }
</script>

<style scoped>
  .imgBox{
    top: 0;
    left: 0;
    position: absolute;
    background: rgba(32, 32, 32,0.7);
    z-index: 1000;
    width: 100%;
    height: 100%;
    text-align: center;
    /*display: flex;*/
    align-items: center;
    /*justify-content: center;*/
    overflow: auto;
  }
  .imgBox img{
    max-width: 150%;
    max-height: 150%;
  }
</style>