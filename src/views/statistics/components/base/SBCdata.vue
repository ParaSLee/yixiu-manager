<template>
<div class="data-contain">
  datas
</div>
</template>

<script>
  
  import { getshopAllData } from '../../../common/api'
  import Mdialog from "./dialog"
  import cityDialog from "./cityChose"
  import Datepicker from 'vuejs-datepicker';
  

  export default {
    props:{
      AllShopData:Object
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
  .data-contain{
    width: 100%;
  }
</style>