<template>
<div>
  <div class="serchBox">

    <mu-raised-button :label="city" class="demo-raised-button cityChoseBtn" @click="showCity"/>

    <cityDialog :dialog="citydialogshow" @changeCity="changeCity" @closeCity="closeCity"></cityDialog>
  
    <mu-raised-button label="查询" @click="toSearch" class="returnBtn" primary :disabled="!findshopAllData.province"/>
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

    <span class="noshop" v-if="noshopshow">该地区尚未有店铺注册！</span>
  </div>

  <div class="cover" v-if="!showDataAsy">
    没有数据
  </div>
  <div class="cover loadingBox" v-else-if="!circleShow">
    <mu-circular-progress :size="90" color="red"/>
    数据获取中...
  </div>

  <SBCdata :AllShopData="areaShopData" v-if="bottomNav=='数据'"></SBCdata>
  <SBCchart :AllShopData="AllShopData" :allcountyData="allcountyData" v-if="bottomNav=='图表'"></SBCchart>
  <SBCtable :AllShopData="AllShopData" v-if="bottomNav=='列表'"></SBCtable>
</div>
</template>

<script>
  
  import { getshopAllData } from '../../common/api'
  import cityDialog from "./base/cityChose"
  import SBCtable from "./base/SBCtable"
  import SBCchart from "./base/SBCchart"
  import SBCdata from "./base/SBCdata"
  import Datepicker from 'vuejs-datepicker';
  

  export default {
    data(){
      return {
        citydialogshow:false,  //显示选择城市
        city:"选择城市",  
        showDataAsy: false,
        circleShow:false,  //数据读取中
        findshopAllData:{
          detail:true, //是否显示店铺详情
          pay:true, //是否缴纳保证金
          qualification:true //审核是否通过
        },
        AllShopData:[],
        // signalShop:{},
        noshopshow:false, //该地区没有店铺时
        bottomNav: '数据',
        bottomNavColor: '数据',
        areaShopData:{}, //存储全部信息
        allcountyData:{},
      }
    },
    components: {
      // Mdialog,
      cityDialog,
      Datepicker,
      SBCtable,
      SBCchart,
      SBCdata
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
      getAllData (){
        let a = {
          pay:true,//是否缴纳了保证金
          qualification:true,//资质认证是否通过
        }
        getshopAllData(a).then(res => {
          this.allcountyData = res;
          let newres = JSON.stringify(res);
          sessionStorage.setItem('allData', newres);
          sessionStorage.setItem('allDataNum', 1);
          // console.log(res)
        },(err => {
          console.log(err)
        }))
      },
      //获取10条问题内容
      getQlist (pickData,type){
        getshopAllData(pickData).then(res => {
          console.log(res)
          if (type!="全部") {
            this.areaShopData = res;
            this.areaShopData.moneyA = this.changeMoneyData(res.turnover,"A");
            this.areaShopData.moneyB = this.changeMoneyData(res.turnover,"B");
          }
          this.listAllShopData(res, type)
        },(err => {
          console.log(err)
        }))
      },
      changeMoneyData(money,type){
        if (type=="B") {
          money = parseInt(money*0.2);
          // console.log(money)
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
      //显示问题内容
      listAllShopData (Arr,type){ 
        if (Arr.shopCount === 0) {
          this.noshopshow = true;
          this.showDataAsy = false;
        }else{
          this.AllShopData = Arr.shoplist;
          for(let i in Arr.shoplist){
            this.AllShopData[i].time = this.datestr(Arr.shoplist[i].createdAt,"yyyy.MM.d");
            this.AllShopData[i].id = this.idstr(Arr.shoplist[i]._id);
            this.AllShopData[i].allmoney = this.OrderAllMoney(Arr.shoplist[i].orderlist)
          }
          this.showDataAsy = true;
        }
        setTimeout(()=>{
          this.circleShow = true;
        },0)
      },
      OrderAllMoney(Arr){
        let money = 0;
        for(let i in Arr){
          if (Arr.state!="10"&&Arr.state!="100"&&Arr.state!="101"&&Arr.state!="102") {
            money += parseInt(Arr[i].price);
          }
        }
        money = money/100;
        return money;
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
    },
    created(){
      let allnum = sessionStorage.getItem('allDataNum');
      if (allnum && ( parseInt(allnum)%5 !== 0) ) {
        allnum = parseInt(allnum)+1;
        sessionStorage.setItem('allDataNum', allnum);
        this.allcountyData = JSON.parse(sessionStorage.getItem('allData'));
      }else{
        this.getAllData();
      }
    }
  }
</script>

<style scoped>
  .serchBox{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .cityChoseBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .circleBox{
    position: absolute;
    margin-top: -55px;
    margin-left: 120px;
  }
  .returnBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .noshop{
    position: absolute;
    margin-top: 60px;
    margin-left: 180px;
    color:#F27370;
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
</style>