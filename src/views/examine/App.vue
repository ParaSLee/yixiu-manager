<template>
<div>
  <mu-text-field hintText="搜索商户" v-model="searchText"/>
  <mu-raised-button label="返回全部" @click="returnAll" v-if="returnAllShow" class="returnBtn" primary/>

  <br/>
  <input type="text" v-model="searchText" @keyup.enter="toSearch" class="myinput">
  <mu-table :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
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
      <mu-tr v-for="shop in shopData" :key="shop._id">
        <mu-td>{{ shop.id }}</mu-td>
        <mu-td>{{ shop.name }}</mu-td>
        <mu-td>{{ shop.contactNumber}}</mu-td>
        <mu-td>{{ shop.time}}</mu-td>
        <mu-td>
          <span v-if="shop.qualification===false" class="wait">待审核</span>
          <span v-else-if="shop.qualification===0" class="unpass">未通过</span>
          <span v-else-if="shop.qualification===1" class="normal">正常</span>
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click="open(shop)" />
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
        </mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>


  <Mdialog @close="close" :shopData="signalShop" :dialog="dialog"></Mdialog>

   <mu-pagination :total="total" :current="current" @pageChange="handleClick" class="ManagePagination">
   </mu-pagination>
</div>
</template>

<script>
  import { 
    getShopListSort, 
    getShopListAllNumber,
    getShopData
  } from '../common/api'
  import Mdialog from "./components/dialog"

  export default {
    data(){
      return {
        searchText:"",  //搜索的文字
        returnAllShow:false,
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        total: 10,    //总页数
        current: 1,   //当前页数
        findshopLish:{
          // name: "",
          limit:10,//一次获取列表的条数,系统默认为10
          skip:0//跳过几个数据,系统默认为0
        },
        shopData:[
          {
            // name:"", //店铺名
            // createdAt:"",  建立时间
            // time:"", 用于显示的时间
            // qualification: "",   是否通过审核  false未审核  0未通过  1通过
            // _id:"",   传入的ID
            // id:"",   用于显示的ID
            // contactNumber:"",   联系方式
          }
        ],
        //单个shop信息
        signalShop:{

        }
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
      getShopList (pickData){
        this.circleShow = true;
        getShopListSort(pickData).then(res => {
          this.listShopData(res)
        },(err => {
          console.log(err)
        }))
      },
      //显示商家内容
      listShopData (Arr){
        for(let i in Arr){
          Arr[i].time = this.datestr(Arr[i].createdAt,"yyyy.MM.d");
          Arr[i].id = this.idstr(Arr[i]._id);
        }
        this.shopData = Arr;
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
        this.findshopLish.limit=10;
        this.findshopLish.skip=0;
        this.getShopList(this.findshopLish);
        this.returnAllShow = false;
        this.searchText = "";
      },      
      //搜索
      toSearch(){
        this.findshopLish.name=this.searchText;
        this.findshopLish.limit=10;
        this.findshopLish.skip=0;
        this.getShopList(this.findshopLish)
        this.returnAllShow = true;
      },
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
    },
    created(){ 
      this.getShopNumber();
      this.getShopList(this.findshopLish)
    }
  }
</script>

<style scoped>
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
    margin-left: 10px
  }

</style>