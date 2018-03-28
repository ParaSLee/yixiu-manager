<template>
<div class="data-contain">
  <div class="allmoney">
    {{ AllShopData.turnover ?  AllShopData.turnover : "0" }}
    <span>元</span>
  </div>

  <div class="moneyBox">
    <div class="moneyItem">
      交易总额：{{ AllShopData.turnover ?  AllShopData.turnover : "0" }} 元
    </div>
    <div class="line"></div>
    <div class="moneyItem">
      折扣后交易总额：{{ AllShopData.turnoverAfter ?  AllShopData.turnoverAfter : "0" }} 元
    </div>
  </div>
  
  <div>
    订单总量：{{ AllShopData.orderCount ?  AllShopData.orderCount : "0" }} 个
  </div>
  <div>
    店铺数量：{{ AllShopData.shopCount ?  AllShopData.shopCount : "0" }} 个
  </div>
</div>
</template>

<script>
  
  import { getshopAllData } from '../../../common/api'
  import Mdialog from "./dialog"
  import cityDialog from "./cityChose"
  import Datepicker from 'vuejs-datepicker';

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
        // AllShopData:[],
        signalShop:{},
      }
    },
    components: {
      Mdialog,
      cityDialog,
      Datepicker
    },
    methods: {
      //显示问题内容
      /*listAllShopData (Arr){ 
        if (Arr.shopCount === 0) {
          this.circleShow = false;
          this.noshopshow = true;
        }else{
          this.AllShopData = Arr.shoplist;
          for(let i in Arr.shoplist){
            this.AllShopData[i].time = this.datestr(Arr.shoplist[i].createdAt,"yyyy.MM.d");
            this.AllShopData[i].id = this.idstr(Arr.shoplist[i]._id);
            this.AllShopData[i].allmoney = this.OrderAllMoney(Arr.shoplist[i].orderlist)
          }
          this.circleShow = false;
        }
      },
      OrderAllMoney(Arr){
        let money = 0;
        for(let i in Arr){
          if (Arr.state!="10"&&Arr.state!="100"&&Arr.state!="101"&&Arr.state!="102") {
            money += parseInt(Arr[i].price);
          }
        }
        return money;
      },*/
      //弹出
      open (AllShopData) {
        this.dialog = true;
        this.signalShop = AllShopData;
        console.log(this.signalShop);
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalShop = {};
      },
    },
    updata(){
      if (this.AllShopData) {
        this.listAllShopData(this.AllShopData)
      }
    }
  }
</script>

<style scoped>
  @import 'http://cdn.webfont.youziku.com/webfonts/nomal/115403/46865/5abaf73df629d8174c40ea14.css';

  @import 'http://cdn.webfont.youziku.com/webfonts/nomal/115403/46758/5abaf4eaf629d8174c40ea0e.css';

  .data-contain{
    width: 100%;
    font-family: "Source-Han-Ligh110f7f0e581c2cb";
  }
  .allmoney{
    text-align: center;
    font-size: 50px;
    color: #333;
    font-family:'HelveticaNeue';
  }
  .allmoney span{
    font-family:'Source-Han-Ligh110f7f0e581c2cb';
    font-size: 35px;
  }
  .line{
    display: inline-block;
    width: 1px;
    height: 50px;
    background: #333;
    margin-bottom: -15px;
  }
  .moneyBox{
    padding-top: 5px;
    padding-bottom: 5px;
    /*overflow: hidden;*/
  }
  .moneyItem{
    display: inline-block;
    width: 49%;
    height: 50px;
    text-align: center;
    font-size: 30px;
  }
</style>