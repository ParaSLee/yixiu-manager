<template>
<div class="data-contain">
  <div class="allmoney">
    <span class="allmoneyColor">{{ AllShopData.moneyA ? AllShopData.moneyA : "0" }}</span>
    <span>元</span>
  </div>

  <div class="middleLine"></div>

  <div class="moneyBox">
    <div class="moneyItem">
      交易总额：<span>{{ AllShopData.moneyA ? AllShopData.moneyA : "0" }} </span>元
    </div>
    <div class="line"></div>
    <div class="moneyItem">
      平台利润：<span>{{ AllShopData.moneyB ?  AllShopData.moneyB : "0" }} </span>元
    </div>
  </div>

  <div class="middleLine"></div>

  <div class="moneyBox moneyBox2">
    <div class="moneyItem">
      店铺数量：<span>{{ AllShopData.shopCount ?  AllShopData.shopCount : "0" }} </span>个
    </div>
  </div>
  
  <!-- <div class="middleLine"></div> -->
  
  <!-- <div class="moneyBox moneyBox2">
    <div class="moneyItem">
      订单总量：<span>{{ AllShopData.orderCount ?  AllShopData.orderCount : "0" }} </span>个
    </div>
  </div> -->
  
</div>
</template>

<script>

  export default {
    props:{
      AllShopData:[Object,Array]
    },
    data(){
      return {
        dialog: false,    //弹窗
        findshopAllData:{
          detail:true, //是否显示店铺详情
          // pay:true, //是否缴纳保证金
          qualification:true //审核是否通过
        },
        signalShop:{},
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  @font-face
  {
    font-family: HelveticaNeue;
    src: url('../../fonts/HelveticaNeueLTPro-Th.woff') format('woff');/*IE*/
  }
/*  @import 'http://cdn.webfont.youziku.com/webfonts/nomal/115403/46865/5abaf73df629d8174c40ea14.css';
*/
/*  @import 'http://cdn.webfont.youziku.com/webfonts/nomal/115403/46758/5abaf4eaf629d8174c40ea0e.css';
*/
  .data-contain{
    width: 100%;
    /*font-family: "Source-Han-Ligh110f7f0e581c2cb";*/
    font-family: "YouYuan","Microsoft Yahei","PingFang SC";
  }
  .allmoney{
    text-align: center;
    font-size: 50px;
    font-family:'HelveticaNeue';
  }
  .allmoney .allmoneyColor{
    background: -webkit-linear-gradient(120deg, #fa709a 0%, #fee140 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; 
    font-family:'HelveticaNeue';
    font-size: 50px;
  }
  .allmoney span{
    /*font-family:'Source-Han-Ligh110f7f0e581c2cb';*/
    font-family: "YouYuan","Microsoft Yahei","PingFang SC";
    font-size: 30px;
  }
  .line{
    display: inline-block;
    width: 1px;
    height: 50px;
    background: #B8B0B0;
    margin-bottom: -15px;
  }
  .moneyBox{
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .moneyBox2{
    text-align: center;
  }
  .moneyItem{
    display: inline-block;
    width: 49%;
    height: 50px;
    text-align: center;
    font-size: 30px;
  }
  .moneyItem span{
    font-family: 'HelveticaNeue';
    font-size: 32px;
  }
  .middleLine{
    width: 100%;
    height: 1px;
    background: #E2DED3;
    margin-bottom: 20px;
    margin-top: 20px
  }
</style>