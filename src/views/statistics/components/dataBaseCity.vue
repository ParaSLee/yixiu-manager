<template>
<div>
  <div class="serchBox">

    <mu-raised-button :label="city" class="demo-raised-button cityChoseBtn" @click="showCity"/>

    <cityDialog :dialog="citydialogshow" @changeCity="changeCity" @closeCity="closeCity"></cityDialog>
  
    <div class="stateChoseBox">
      <datepicker class="choseTime" language="zh" placeholder="选择开始时间" v-model="chosedStartDay" :format="format"></datepicker>
      <span style="font-size:18px;margin:0 10px;">&nbsp;至</span>
      <datepicker class="choseTime" language="zh" placeholder="选择结束时间" v-model="chosedEndDay" :format="format"></datepicker>
    </div>
    <span class="tips" v-if="showTimetip">如果未选择时间节点，则搜索所有时间内的订单</span>

    <mu-raised-button label="查询" @click="toSearch" class="returnBtn" primary :disabled="city==='选择城市'"/>

    <div class="switchbtn">
      <div class="switchbtnBox">
        <mu-paper>
          <mu-bottom-nav :value="bottomNav" @change="handleChange">
            <mu-bottom-nav-item value="数据" title="数据" icon="filter_9_plus"/>
            <mu-bottom-nav-item value="图表" title="图表" icon="pie_chart"/>
            <mu-bottom-nav-item value="列表" title="列表" icon="assignment"/>
          </mu-bottom-nav>
        </mu-paper>
      </div>
    </div>

    <span class="noshop" v-if="noshopshow">没有订单数据！</span>
  </div>

  <div class="cover" v-if="!showDataAsy">
    没有数据
  </div>
  <div class="cover loadingBox" v-else-if="!circleShow">
    <mu-circular-progress :size="90" color="red"/>
    数据获取中...
  </div>

  <DBCdata :AllShopData="areaShopData" v-if="bottomNav=='数据'"></DBCdata>
  <DBCchart :AllShopData="AllShopData" :allcountyData="allcountyData" v-if="bottomNav=='图表'"></DBCchart>
  <DBCtable :AllShopData="AllOrderData" v-if="bottomNav=='列表'"></DBCtable>

</div>
</template>

<script>
  
  import { getshopAllData, getAllOrderListData,getshopareaData } from '../../common/api'
  import cityDialog from "./base/cityChose"
  import Datepicker from 'vuejs-datepicker';
  import DBCtable from "./base/DBCtable"
  import DBCchart from "./base/DBCchart"
  import DBCdata from "./base/DBCdata"
  

  export default {
    data(){
      return {
        citydialogshow:false,  //显示选择城市
        city:"选择城市",  
        chosedStartDay:"",  //开始日期选择
        chosedEndDay:"",  //结束日期选择
        format:"yyyy-MM-dd",  //日期格式
        showDataAsy: false,
        showTimetip: true,
        circleShow:false,  //数据读取中
        findshopAllData:{
          detail:true, //是否显示店铺详情
          pay:true, //是否缴纳保证金
          qualification:true //审核是否通过
        },
        AllShopData:[],
        AllOrderData:[],
        noshopshow:false, //该地区没有店铺时
        bottomNav: '数据',
        bottomNavColor: '数据',
        areaShopData:{}, //存储全部信息
        allcountyData:{},
      }
    },
    components: {
      cityDialog,
      Datepicker,
      DBCtable,
      DBCchart,
      DBCdata
    },
    methods: {
      showCity(){
        this.citydialogshow = true;
      },
      closeCity(){
        this.citydialogshow = false;
      },
      changeCity(city){
        if (city.province=="") {
        }else if (city.county=="" && city.area=="") {
          this.findshopAllData.province = city.province;
          this.city = `${city.province}`;
        }else if(city.area==""){
          this.findshopAllData.province = city.province;
          this.findshopAllData.city = city.county;
          this.city = `${city.province} : ${city.county}`;
        }else{
          this.findshopAllData.province = city.province;
          this.findshopAllData.city = city.county;
          this.findshopAllData.district = city.area;
          this.city = `${city.province} : ${city.county} - ${city.area}`;
        }
        this.citydialogshow = false;
      },
      getQlist (pickData,type){
        getshopAllData(pickData).then(res => {
          if (type!="全部") {
            this.areaShopData = res;
            this.areaShopData.moneyA = this.changeMoneyData(res.turnover);
            this.areaShopData.moneyB = this.changeMoneyData(res.turnoverAfter);
          }
          this.listAllShopData(res, type)
        },(err => {
          console.log(err)
        }))
      },
      changeMoneyData(money){
        if (money<100) {
          return (money/100);
        }else{
          let Allmoney = money.toString();
          let Intmoney = Allmoney.substr(0,Allmoney.length-2)
          let decimal = Allmoney.substr(Allmoney.length-2)
          for (var i = 0; i < Math.floor((Intmoney.length-(1+i))/3); i++)
          {
            Intmoney = Intmoney.substring(0,Intmoney.length-(4*i+3))+','+Intmoney.substring(Intmoney.length-(4*i+3));
          }
          return (Intmoney+"."+decimal)
        }
      },
      //填入获取到的内容
      inputArr(Arr){
        Arr.time = this.datestr(Arr.createdAt,"yyyy.MM.d");
        Arr.id = this.idstr(Arr._id);
        Arr.allmoney = this.changeMoneyData(Arr.price);

        if (Arr.paymentType===0) {
          Arr.paymentTypeW = "在线支付";
        }else if (Arr.paymentType===1){
          Arr.paymentTypeW = "线下支付";
        }else if (Arr.paymentType===2){
          Arr.paymentTypeW = "修好后支付";
        }

        if(this.searchShop!=""){
          Arr.name = Arr.user.name;
        }else if(this.searchUser!=""){
          Arr.name = 123;
        }

        if (Arr.serviceWay=="1") {
          Arr.serviceWayW = "上门服务";
        }else if (Arr.serviceWay=="2"){
          Arr.serviceWayW = "自行到店";
        }else{
          Arr.serviceWayW = "其他";
        }

        switch(Arr.state){
          case 10:
            Arr.stateW="待付款";
            break;
          case 11:
            Arr.stateW="已付款";
            break;
          case 12:
            Arr.stateW="维修中";
            break;
          case 13:
            Arr.stateW="已完成";
            break;
          case 14:
            Arr.stateW="待评价";
            break;
          case 15:
            Arr.stateW="评价完成";
            break;
          case 100:
            Arr.stateW="已取消";
            break;
          case 101:
            Arr.stateW="已关闭";
            break;
          case 102:
            Arr.stateW="退款中";
            break;
        }
      },
      //显示问题内容
      listAllShopData (Arr,type){ 
        console.log(Arr)
        if (Arr.shopCount === 0) {
          this.noshopshow = true;
          this.showDataAsy = false;
        }else{
          this.AllShopData = Arr.shoplist;

          for(let i of Arr.shoplist){
            for(let j of i.orderlist){
              this.inputArr(j)
              j.father = {
                _id:i._id,
                name:i.name,
                address:i.address,
                contactNumber:i.contactNumber
              }
            }
            this.AllOrderData = this.AllOrderData.concat(i.orderlist)
          }
          this.showDataAsy = true;
        }
        // console.log(this.AllOrderData)
        setTimeout(()=>{
          this.circleShow = true;
        },0)
      },
      //搜索
      toSearch(){
        this.getQlist(this.findshopAllData)
        this.noshopshow = false;
        this.circleShow = false;
        this.showDataAsy = true;
      },
      handleChange (val) {
        this.bottomNav = val
      },
    }
  }
</script>

<style scoped>
  .choseTime{
    margin-left: 7px;
    margin-bottom: 20px;
    border-bottom: 3px solid #eee;
    padding-bottom: 3px;
    padding-left: 5px;
  }
  .serchBox{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .stateChoseBox{
    display: flex;
    flex-direction: row;
    margin-left: 6px;
  }
  .tips{
    margin-left: 20px;
    font-size: 14px;
    margin-bottom: 20px;
    color: rgb(126, 87, 194);
  }
  .returnBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .switchbtn{
    position: absolute;
    right: 7%;
  }
  .switchbtnBox{
    float: right;
  }
  .cover{
    position: absolute;
    width: 100%;
    height: 100%;
    margin-left: -68px;
    background-image: linear-gradient(90deg, rgba(253, 251, 251,0.8) 0%, rgba(235, 237, 238,0.9) 100%);
    box-sizing: border-box;
    border-right: 288px;
    font-size: 60px;
    text-align: center;
    padding-top: 360px;
    z-index: 10;
  }
  .cityChoseBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .loadingBox{
    padding-top: 270px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>