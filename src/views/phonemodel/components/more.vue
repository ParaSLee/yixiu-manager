<template>
<div class="cover" v-if="dialog">
  <div class="coverbg" @click="close">
    <div class="witeBg">
    
      <mu-raised-button v-for="(item,index) in phonebrandname" :label="item" class="demo-raised-button my-btn"/>      

    </div>
  </div>
  <!-- <mu-dialog :open="dialog" :title="'更多品牌'" @close="close" scrollable class="dialogBox"> -->
    
    
  </mu-dialog>
</div>
</template>

<script>


  export default {
    props:{
      phonebrandname:[Object,Array],
      dialog:Boolean
    },
    data(){
      return {

      }
    },
    components: {

    },
    methods: {
      //关闭dialog
      close(){
        this.$emit("close")
      }
    },
    created(){ 
    }
  }
</script>

<style scoped> 
  .cover{
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font-weight: 400;
    vertical-align: baseline;
  }
  .coverbg{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
  }
  .witeBg{
    position: relative;
    width: 70%;
    height: 600px;
    background: #fff;
    margin: 0 auto;
    top: 15%;
    border-radius: 2px;
    font-size: 16px;
    box-shadow: 0 19px 60px rgba(0,0,0,.298039), 0 15px 20px rgba(0,0,0,.219608);
    overflow-y: auto;
  }
  .my-btn{
    width: 20%;
    height: 100px;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 50px;
    margin-top: 50px;
  }
</style>