<template>
<div class="charts-contain">
  <div id="main" style="width: 600px;height:400px;"></div>
</div>
</template>

<script>
  export default {
    props:{
      AllShopData:[Object,Array],
      allcountyData:[Object,Array],
    },
    data(){
      return {
        dialog: false,    //弹窗
        findshopAllData:{
          detail:true, //是否显示店铺详情
          // pay:true, //是否缴纳保证金
          qualification:true //审核是否通过
        },
        // AllShopData:[],
        signalShop:{},
      }
    },
    components: {
     
    },
    methods: {
      
    },
    updata(){
      if (this.AllShopData) {
        this.listAllShopData(this.AllShopData)
      }
    }
  }
</script>

<style scoped>
  .charts-contain{
    width: 100%;
  }
</style>