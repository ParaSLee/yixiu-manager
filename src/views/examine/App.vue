<template>
<div>
  <div class="serchBox">
    <mu-select-field v-model="serchstate" label="选择审核状态" class="serchstateBox">
      <mu-menu-item value="全部" title="全部"/>
      <mu-menu-item value="待审核" title="待审核"/>
      <mu-menu-item value="正常" title="正常"/>
      <mu-menu-item value="未通过" title="未通过"/>
    </mu-select-field>

    <mu-text-field hintText="搜索商户名" v-model="searchText" style="width:200px;"/>

    <mu-raised-button label="搜索" @click="toSearch" class="returnBtn" primary/>
    
    <mu-raised-button label="返回全部" @click="returnAll" v-if="returnAllShow" class="returnBtn" primary/>
  </div>
  <p class="payment">
    总保证金：<span>{{ payment }}</span> 元  
    <span class="spm"></span>
    总商户：<span>{{ shopCount }}</span> 家 
  </p>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mu-table enableSelectAll :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>ID</mu-th>
        <mu-th>商户名</mu-th>
        <mu-th>联系方式</mu-th>
        <mu-th>创建时间</mu-th>
        <mu-th>商家状态</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="shop in shopData" :key="shop._id" >
        <mu-td>{{ shop.id }}</mu-td>
        <mu-td>{{ shop.name }}</mu-td>
        <mu-td>{{ shop.contactNumber}}</mu-td>
        <mu-td>{{ shop.time}}</mu-td>
        <mu-td>
          <span v-if="shop.qualificationState==='待审核'" class="wait">待审核</span>
          <span v-else-if="shop.qualificationState==='未通过'" class="unpass">未通过</span>
          <span v-else-if="shop.qualificationState==='正常'" class="normal">正常</span>
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(shop)" />
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
        </mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>

  <!-- <div class="deleteShopBtn">
    <mu-raised-button label="删除商户" class="demo-raised-button" secondary @click="delShop"/>
  </div> -->
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>


  <Mdialog @close="close" @delclose="getShopList(findshopLish)" :shopData="signalShop" :dialog="dialog"></Mdialog>

  <mu-pagination v-if="!returnAllShow" :total="total" :current="current" @pageChange="handleClick" class="ManagePagination">
  </mu-pagination>

  <div v-else class="ManagePagination">
    <mu-raised-button v-if="nextpage" label="获取更多内容" primary class="demo-raised-button" @click="moreSearch" :disabled="loading"/>
    <mu-raised-button v-else label="已无法获取更多内容" class="demo-raised-button" disabled/>
  </div>
  

  <!-- <mu-dialog :open="dialog2" title="尚未选择要删除的内容" @close="nodelcolse">
    <mu-flat-button slot="actions" primary @click="nodelcolse" label="确定"/>
  </mu-dialog>

  <mu-dialog :open="dialog3" title="确定要删除吗？" @close="delcolse">
    <p v-for="list in delshopList">{{ shopData[list].name }}</p>
    <mu-flat-button slot="actions" @click="delcolse" primary label="取消"/>
    <mu-flat-button slot="actions" primary @click="delOK" secondary label="删除"/>
  </mu-dialog> -->
</div>
</template>

<script>
  import { 
    getShopListSort, 
    getShopListAllNumber,
    getVideoData
  } from '../common/api'
  import Mdialog from "../common/dialog"

  export default {
    data(){
      return {
        loading:true,
        nextpage:true,
        serchstate:"全部",  // 搜索的状态
        searchText:"",  // 搜索的文字
        returnAllShow:false,
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        // dialog2:false,   //点击删除却没有选择内容的时候
        // dialog3:false,   //取消删除
        total: 10,    //总页数
        current: 1,   //当前页数
        findshopLish:{
          // name: "",
          limit:10,//一次获取列表的条数,系统默认为10
          skip:0//跳过几个数据,系统默认为0
        },
        shopData:[
          // {
            // name:"", //店铺名
            // createdAt:"",  建立时间
            // time:"", 用于显示的时间
            // qualificationState: "",   是否通过审核  false未审核  0未通过  1通过
            // _id:"",   传入的ID
            // id:"",   用于显示的ID
            // contactNumber:"",   联系方式
          // }
        ],
        findorderList:{
          collection:"Shop",
        },
        payment:0,
        shopCount:0,
        //单个shop信息
        signalShop:{},
        // delshopList:[]//存储要删除Shop的ID
      }
    },
    components: {
      Mdialog
    },
    methods: {
      //点击页码
      handleClick (newIndex) {
        this.findshopLish.limit = 10*newIndex;
        this.findshopLish.skip = this.findshopLish.limit-10;
        this.getShopList(this.findshopLish);
      },
      //获取10条商家内容
      getShopList (pickData,type){
        this.circleShow = true;
        getShopListSort(pickData).then(res => {
          this.listShopData(res, type)
          return {pickData,type};
        },(err => {
          console.log(err)
        })).then((pickData,type) => {
          if (type!=="增加") {
            this.allDeposit(pickData);
          }
        })
      },
      allDeposit(type){
        if (type.qualificationState!=undefined) {
          this.findorderList.qualificationState = type.qualificationState;
        }else{
          delete this.findorderList.qualificationState
        }
        if (type.name!=undefined) {
          this.findorderList.name = {$regex:type.name};
        }else{
          delete this.findorderList.name
        }
        getVideoData(this.findorderList).then(res => {
          //console.log(res)
          let allpayment = 0;
          for(let i of res){
            allpayment += i.payment;
          }
          this.payment = allpayment/100;
          this.shopCount = res.length;
        },(err => {
          console.log(err)
        }))
      },
      //显示商家内容
      listShopData (Arr,type){
        for(let i in Arr){
          Arr[i].time = this.datestr(Arr[i].createdAt,"yyyy.MM.d");
          Arr[i].id = this.idstr(Arr[i]._id);
        }
        if (type==="增加") {
          if (Arr.length < 10) {
            this.nextpage = false;
          }
          this.shopData = this.shopData.concat(Arr);
          this.returnAllShow = true;
          this.loading=false;
        }else{
          this.shopData = Arr;
          if (Arr.length < 10) {
            this.nextpage = false;
          }
          this.loading=false;
        }
        // this.delshopList = [];
        this.circleShow = false;
      },
      //获取商家总数
      getShopNumber (){
        getShopListAllNumber().then(res => {
          this.total = res;
        },(err => {
          console.log(err)
        }))
      },
      //返回全部搜索
      returnAll(){
        delete this.findshopLish.name;
        delete this.findshopLish.qualificationState;
        this.findshopLish.limit=10;
        this.findshopLish.skip=0;
        this.getShopList(this.findshopLish);
        this.returnAllShow = false;
        this.searchText = "";
        this.serchstate = "全部";
      },      
      //获取更多搜索内容
      moreSearch(){
        if (this.serchstate === "全部") {
          delete this.findshopLish.qualificationState;
        }else{
          this.findshopLish.qualificationState = this.serchstate;
        }
        if (this.searchText !== "") {
          this.findshopLish.name=this.searchText;
        }
        this.loading = true;
        this.findshopLish.limit+=10;
        this.findshopLish.skip+=10;
        let type = "增加";
        this.getShopList(this.findshopLish,type)
      },
      //搜索
      toSearch(){
        if (this.serchstate === "全部") {
          delete this.findshopLish.qualificationState;
        }else{
          this.findshopLish.qualificationState = this.serchstate;
        }
        if (this.searchText !== "") {
          this.findshopLish.name=this.searchText;
        }

        this.findshopLish.limit=10;
        this.findshopLish.skip=0;
        // let type = "增加";
        this.getShopList(this.findshopLish)
        this.loading = true;
        this.returnAllShow = true;
        this.nextpage = true;
        if (this.serchstate === "全部" && this.searchText === "") {
          this.returnAllShow = false;
        }
      },
      /*
      //添加删除ID
      addID(list){
        this.delshopList = list
      },
      //删除商户
      delShop(){
        let delData = [];
        for(let ind in this.delshopList){
          delData[ind] = this.shopData[ind]._id;
        }
        if (!delData || delData.length === 0) {
          this.dialog2 = true;
        }else{
          this.dialog3 = true;
        }
      },
      delOK(){
      
      },
      */
      //弹出
      open (shopData) {
        this.dialog = true;
        this.signalShop = shopData;
        console.log(this.signalShop);
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalShop = {};
      }
      /*
      nodelcolse(){
        this.dialog2 = false;
      },
      delcolse(){
        this.dialog3 = false;
      }
      */
    },
    created(){ 
      this.getShopNumber();
      this.getShopList(this.findshopLish)
    }
  }
</script>

<style scoped>
  .serchBox{
    display: flex;
    align-items: flex-end;
  }
  .serchstateBox{
    width: 100px;
    margin-right: 20px;
  }
  .listTable{
    margin-top: 30px;
  }
  .mu-table tbody{
    line-height: 48px;
  }
  .deleteShopBtn{ 
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
  .unpass{
    color: #E43A19;
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
  .deleteShopBtn{ 
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
  .payment{
    font-size: 16px;
  }
  .payment span{
    font-size: 18px;
  }
  .spm{
    margin-right: 30px;
  }
</style>