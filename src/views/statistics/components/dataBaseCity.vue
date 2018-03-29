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

  <DBCdata :AllShopData="shopData" v-if="bottomNav=='数据'"></DBCdata>
  <DBCchart :AllShopData="AllShopData" :allcountyData="allcountyData" v-if="bottomNav=='图表'"></DBCchart>
  <DBCtable :AllShopData="AllShopData" :loading="loading" :nextpage="nextpage" @moreSearch="moreSearch" @changeState="changeState" v-if="bottomNav=='列表'"></DBCtable>

</div>
</template>

<script>
  
  import { getshopAllData, getAllOrderListData } from '../../common/api'
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
        loading:true,
        nextpage:true,
        circleShow:false,  //数据读取中
        findquestion:{
          shop:"",
          limit:10, //一次获取列表的条数,系统默认为10
          skip:0 //跳过几个数据,系统默认为0
        },
        AllShopData:[],
        noshopshow:false, //该地区没有店铺时
        bottomNav: '数据',
        bottomNavColor: '数据',
        shopData:{}, //存储全部信息
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
      //获取该商家所有数据
      getAll(id){
        this.circleShow = true;
        let a = {
          _id:id
        }
        getshopAllData(a).then(res => {
          // console.log(res);
          this.listquestionData(res);
        },(err => {
          console.log(err)
        }))
      },
      getList(type){
        this.findquestion.shop=this.user.id;
        getAllOrderListData(this.findquestion).then(res => {
          this.listOrderData(res,type);
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
      //显示总数据内容
      listquestionData (Arr){
        console.log(Arr);
        this.shopData = Arr;
        this.shopData.moneyA = this.changeMoneyData(Arr.turnover);
        this.shopData.moneyB = this.changeMoneyData(Arr.turnoverAfter);
        this.getList();
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
      listOrderData (Arr,type){
        console.log(Arr)
        for(let i in Arr){
          this.inputArr(Arr[i])
        }
        if (type==="增加") {
          if (Arr.length < 10) {
            this.nextpage = false;
          }
          this.AllShopData = this.AllShopData.concat(Arr);
        }else{
          this.AllShopData = Arr;
          if (Arr.length < 10) {
            this.nextpage = false;
          }
        }

        this.showDataAsy = true;
        this.loading=false;
        this.circleShow = false;
      },
      //搜索
      toSearch(){
        this.noshopshow = false;
        delete this.findquestion.state;
        this.findquestion.limit = 10;
        this.findquestion.skip = 0;

        this.getAll(this.user.id)
      },
      moreSearch(){
        this.findquestion.limit +=10;
        this.findquestion.skip +=10; 
        this.getList("增加")
      },
      changeState(state){
        this.findquestion.state = []
        for(let i in state){
          if (state[i]=="全部") {
            delete this.findquestion.state;
          }else if (state[i]=="已付款") {
            this.findquestion.state = this.findquestion.state.concat(11);
          }else if (state[i]=="待付款") {
            this.findquestion.state = 10;
            // this.findquestion.state = this.findquestion.state.concat(10);
          }else if (state[i]=="已完成") {
            this.findquestion.state = this.findquestion.state.concat(13);
            this.findquestion.state = this.findquestion.state.concat(14);
            this.findquestion.state = this.findquestion.state.concat(15);
          }else if (state[i]=="已取消") {
            this.findquestion.state = this.findquestion.state.concat(100);
            this.findquestion.state = this.findquestion.state.concat(101);
            this.findquestion.state = this.findquestion.state.concat(102);
          }else if(state[i]=="维修中"){
            this.findquestion.state = this.findquestion.state.concat(12);
          }
        }
        this.getList();
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
  /*.stateChoseItem{
    margin-right: 20px;
  }*/
  .userChoseBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .listTable{
    margin-top: 30px;
  }
  .mu-table tbody{
    line-height: 48px;
  }
  .deletequetionBtn{ 
    margin-top: 30px;
  }
  .ManagePagination{
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .btnBox{
    margin-right: 20px;
  }
  .circleBox{
    position: absolute;
  }
  .checkI{
    margin-bottom: -5px;
    margin-left: -38px;
  }
  .normal{
    color: #17B978;
  }
  .wait{
    color: #EC7700;
  }
  .chosed{
    color: #00B7C2;
  }
  .closed{
    /*color: */
  }
  .myinput{
    position: absolute;
    display: inline-block;
    width: 256px;
    height: 32px;
    font-size: 16px;
    background: transparent;
    color: transparent;
    outline-color: rgb(224, 224, 224);
    margin-top: -51px;
  }
  .returnBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .deletequetionBtn{ 
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
  .texthidden{
    white-space:nowrap; 
    overflow: hidden;
    text-overflow:ellipsis;
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
</style>