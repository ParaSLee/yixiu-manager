<template>
<div>
  <mu-dialog :open="dialog" title="商户详情" @close="close" scrollable>   
    
    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
    
  </mu-dialog>

  

</div>
</template>

<script>
  export default {
    props:{
      shopData:Object,
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
      },
    },
    created(){ 
      this.chosevalue = this.shopData.qualificationState;
      this.shop.qualificationState = this.chosevalue;
    }
  }
</script>

<style scoped>
  .dialogBox{
    font-size: 18px;
    margin-bottom: 5px;
    padding-bottom: 5px;
    border-bottom: 0.5px solid rgba(153, 153, 153,0.1);

    display: flex;
    align-items: center;

  }
  .messageTitle{
    display: inline-block;
    text-align: right;
    width: 126px;
    margin-right: 5px;
  }
  .cover{
    max-width: 200px;
    max-height: 200px; 
  }
  .normal{
    color: #17B978;
  }
  .wait{
    color: #EC7700;
  }
  .unpass{
    color: #E43A19;
  }
  .changestateBtn{
    margin-left: 10px;
  }
  .checkBox{
    display: flex;
    align-items: center;
  }
  .changestateBox{
    display: flex;
    align-items: center;
  }
  .changestateBox label{
    margin-right: 10px;
  }
  .changestateBox button{
    margin-left: 10px;
  }
  .beforeImg{
    max-width: 240px;
    max-height: 240px;
  }
</style>