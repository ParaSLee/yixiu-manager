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
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <div class="cover" v-if="!showDataAsy">
    没有数据
  </div>

  <SBCdata :AllShopData="areaShopData" v-if="bottomNav=='数据'"></SBCdata>
  <SBCchart :AllShopData="AllShopData" :allcountyData="allcountyData" v-if="bottomNav=='图表'"></SBCchart>
  <SBCtable :AllShopData="AllShopData" v-if="bottomNav=='列表'"></SBCtable>
</div>
</template>

<script>
  
  import { getshopAllData } from '../../common/api'
  import Mdialog from "./base/dialog"
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
          // pay:true, //是否缴纳保证金
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
      Mdialog,
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
        if (city.province=="选择省份") {
        }else if (city.county=="选择城市" && city.area=="选择地区") {
          this.findshopAllData.province = city.province;
          this.city = `${city.province}`;
        }else if(city.area=="选择地区"){
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
          console.log(res)
        },(err => {
          console.log(err)
        }))
      },
      //获取10条问题内容
      getQlist (pickData,type){
        this.circleShow = true;
        getshopAllData(pickData).then(res => {
          if (type!="全部") {
            this.areaShopData = res;
          }
          this.listAllShopData(res, type)
        },(err => {
          console.log(err)
        }))
      },
      //显示问题内容
      listAllShopData (Arr,type){ 
        if (Arr.shopCount === 0) {
          this.circleShow = false;
          this.noshopshow = true;
          this.showDataAsy = false;
        }else{
          this.AllShopData = Arr.shoplist;
          for(let i in Arr.shoplist){
            this.AllShopData[i].time = this.datestr(Arr.shoplist[i].createdAt,"yyyy.MM.d");
            this.AllShopData[i].id = this.idstr(Arr.shoplist[i]._id);
            this.AllShopData[i].allmoney = this.OrderAllMoney(Arr.shoplist[i].orderlist)
          }
          this.circleShow = false;
          this.showDataAsy = true;
        }
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
        this.loading = true;
        this.noshopshow = false;
      },
      handleChange (val) {
        this.bottomNav = val
      },
    },
    created(){
      this.getAllData();
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
    margin-bottom: 20px;
    margin-left: 6px;
  }
  .stateChoseItem{
    margin-right: 20px;
  }
  .cityChoseBtn{
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
    margin-top: -55px;
    margin-left: 120px;
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
  .noshop{
    position: absolute;
    /*top: 0;*/
    margin-top: 60px;
    margin-left: 180px;
    color:#F27370;
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
  .enterDetail{
    margin-left: -20px;
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
    background-image: linear-gradient(90deg, #fdfbfb 0%, #ebedee 100%);
    box-sizing: border-box;
    border-right: 288px;
    font-size: 60px;
    text-align: center;
    padding-top: 360px;
  }
</style>