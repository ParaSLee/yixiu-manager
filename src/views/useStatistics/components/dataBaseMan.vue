<template>
<div class="boxpad">
  <div class="serchBox">

    <mu-raised-button :label="user.name" class="demo-raised-button userChoseBtn" @click="showuser"/>

    <userDialog :dialog="userdialogshow" @getuser="getuser" @closeuser="closeuser"></userDialog>
  
    <div class="stateChoseBox">
      <datepicker class="choseTime" language="zh" placeholder="选择开始时间" v-model="chosedStartDay" :format="format"></datepicker>
      <span class="deltime" @click="clearTime('start')">清除</span>
      <span style="font-size:18px;margin:0 10px;">&nbsp;至</span>
      <datepicker class="choseTime" language="zh" placeholder="选择结束时间" v-model="chosedEndDay" :format="format"></datepicker>
      <span class="deltime" @click="clearTime('end')">清除</span>
    </div>
    <span class="tips" v-if="showTimetip">{{ timeTips }}</span>
    <span class="tips errtips" v-if="showTimetipErr">{{ timeTips }}</span>

    <mu-raised-button label="查询" @click="toSearch" class="returnBtn" primary :disabled="user.name==='选择商户'"/>

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

  <DBMdata :AllShopData="shopData" v-if="bottomNav=='数据'"></DBMdata>
  <DBMchart :AllShopData="AllShopData" :allcountyData="allcountyData" v-if="bottomNav=='图表'"></DBMchart>
  <DBMtable :AllShopData="AllShopData" :loading="loading" :nextpage="nextpage" @moreSearch="moreSearch" @changeState="changeState" v-if="bottomNav=='列表'"></DBMtable>

</div>
</template>

<script>
  
  import { getshopAllData, getAllOrderListData } from '../../common/api'
  import userDialog from "./base/userChose"
  import Datepicker from 'vuejs-datepicker';
  import DBMtable from "./base/DBMtable"
  import DBMchart from "./base/DBMchart"
  import DBMdata from "./base/DBMdata"
  

  export default {
    data(){
      return {
        userdialogshow:false,  //显示选择程序
        user:{
          name:"选择商户",
          id:"",
        }, 
        chosedStartDay:"",  //开始日期选择
        chosedEndDay:"",  //结束日期选择
        format:"yyyy-MM-dd",  //日期格式
        showDataAsy: false,
        timeTips:"如果未选择时间节点，则搜索所有时间内的订单",
        showTimetip: true,
        showTimetipErr: false,
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
      userDialog,
      Datepicker,
      DBMtable,
      DBMchart,
      DBMdata
    },
    methods: {
      showuser(){
        this.userdialogshow = true;
      },
      closeuser(){
        this.userdialogshow = false;
      },
      getuser(user){
        this.userdialogshow = false;
        this.user = user;
      },
      //获取该商家所有数据
      getAll(id,time){
        this.circleShow = true;
        let a = {
          _id:id,
          orderCreatedAt:time,
          detail:true
        }
        getshopAllData(a).then(res => {
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
      changeMoneyData(money,type){
        if (type=="B") {
          money = parseInt(money*0.2);
          console.log(money)
        }
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
        this.shopData = Arr;
        this.shopData.moneyA = this.changeMoneyData(Arr.turnover,"A");
        this.shopData.moneyB = this.changeMoneyData(Arr.turnover,"B");
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
          Arr.name = Arr.user?Arr.user.name:"";
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
        if (this.AllShopData.length == 0) {
          this.noshopshow = true;
        }
        setTimeout(()=>{
          this.circleShow = true;
        },0)

        this.showDataAsy = true;
        this.loading=false;
      },
      clearTime(type){
        if (type==="start") {
          this.chosedStartDay = "";
        }else if (type==="end"){
          this.chosedEndDay = "";
        }
      },
      setTimeZero(TimeDate,type){
        if (type==='start') {
          TimeDate.setHours(0);
          TimeDate.setMinutes(0);
          TimeDate.setSeconds(0);
          TimeDate.setMilliseconds(0);
        }else if(type==='end'){
          TimeDate.setHours(23);
          TimeDate.setMinutes(59);
          TimeDate.setSeconds(59);
          TimeDate.setMilliseconds(0);
        }
      },
      //搜索
      toSearch(){
        let start, end;
        if (this.chosedStartDay) {
          this.setTimeZero(this.chosedStartDay,'start');
          start = this.chosedStartDay/1000;
        }else{
          start = "";
        }
        if (this.chosedEndDay) {
          this.setTimeZero(this.chosedEndDay,'end');
          end = this.chosedEndDay/1000;
        }else{
          end = "";
        }
        this.findquestion.createdAt = {};

        if (start === "" && end === "") {
          delete this.findquestion.createdAt;
        }else if (start !== "" && end === "") {
          this.user.orderCreatedAt = {
            $gte:start
          }
          this.findquestion.createdAt = {
            $gte:start
          }
          this.timeTips = `从 ${this.chosedStartDay.getFullYear()}-${this.chosedStartDay.getMonth()+1}-${this.chosedStartDay.getDate()} 至 今`;
        }else if (start === "" && end !== "") {
          this.user.orderCreatedAt = {
            $lte:end
          }
          this.findquestion.createdAt = {
            $lte:end
          }
          this.timeTips = `从 最初 至 ${this.chosedEndDay.getFullYear()}-${this.chosedEndDay.getMonth()+1}-${this.chosedEndDay.getDate()}`;
        }else if (start !== "" && end !== "" && start <= end){
          this.user.orderCreatedAt = {
            $gte:start,
            $lte:end
          }
          this.findquestion.createdAt = {
            $gte:start,
            $lte:end
          }
          this.timeTips = `从 ${this.chosedStartDay.getFullYear()}-${this.chosedStartDay.getMonth()+1}-${this.chosedStartDay.getDate()} 至 ${this.chosedEndDay.getFullYear()}-${this.chosedEndDay.getMonth()+1}-${this.chosedEndDay.getDate()}`;
        }else if(start > end){
          this.showTimetip = false;
          this.showTimetipErr = true;
          this.timeTips="开始时间不能大于结束时间！";
          return 0;
        }

        delete this.findquestion.state;
        this.findquestion.limit = 10;
        this.findquestion.skip = 0;

        this.noshopshow = false;
        this.circleShow = false;
        this.showDataAsy = true;

        this.getAll(this.user.id, this.user.orderCreatedAt)
      },
      moreSearch(){
        this.findquestion.limit +=10;
        this.findquestion.skip +=10; 
        this.getList("增加")
      },
      changeState(state){
        this.findquestion.state = 0;
        if (state=="全部") {
          delete this.findquestion.state;
        }else if (state=="已付款") {
          this.findquestion.state = 11;
        }else if (state=="待付款") {
          this.findquestion.state = 10;
        }else if (state=="已完成") {
          this.findquestion.state = 13;
        }else if (state=="已取消") {
          this.findquestion.state = 100;
        }else if(state=="维修中"){
          this.findquestion.state = 12;
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
  .userChoseBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .returnBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .switchbtn{
    position: absolute;
    right: 7%;
    top: 113px;
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
    font-family: "YouYuan","Microsoft Yahei","PingFang SC";
  }
  .loadingBox{
    padding-top: 270px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .deltime{
    display: inline-block;
    height: 27px;
    margin-left: -35px;
    padding: 1px 5px;
    z-index: 10;
    cursor: pointer;
  }
  .deltime:hover{
    background: rgb(229, 229, 229);
  }
  .boxpad{
    padding: 3% 5%;
  }
</style>