<template>
<div>
  <div class="serchBox">
    <p style="color:rgb(185, 185, 185);margin-bottom:10px;">商户ID和用户手机号至少填一个,但是不能同时填入</p>
    <mu-text-field hintText="根据商户ID搜索" v-model="searchShop" :disabled="searchUser!=''"/>
    <p class="tip">为了确保精准度，请使用商户id搜索</p>

    <mu-text-field hintText="根据用户手机号搜索" v-model="searchUser" :disabled="searchShop!=''"/>

    <mu-raised-button label="搜索" @click="toSearch" class="returnBtn" primary/>
    
    <mu-raised-button label="清空" @click="clearBtn" class="returnBtn"/>

    <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
  </div>

  <br/>

  <mu-table multiSelectable enableSelectAll :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>订单号</mu-th>
        <mu-th>支付方式</mu-th>
        <mu-th>创建时间</mu-th>
        <mu-th>总金额</mu-th>
        <mu-th>对方名称</mu-th>
        <mu-th>备注</mu-th>
        <mu-th>订单状态</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="(order,index) in orderData" :key="index">
        <mu-td>{{ order.id }}</mu-td>
        <mu-td>{{ order.paymentTypeW }}</mu-td>
        <mu-td>{{ order.time }}</mu-td>
        <mu-td>{{ order.price/100 }}</mu-td>
        <mu-td>{{ order.name }}</mu-td>
        <mu-td>{{ order.remark }}</mu-td>
        <mu-td>
          <span :class="stateStyle[order.stateW]">{{ order.stateW }}</span>
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(order)" />
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
        </mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>

  <!-- <div class="deleteShopBtn">
    <mu-raised-button label="删除订单" class="demo-raised-button" secondary @click="delShop"/>
  </div> -->
  
  


  <Mdialog @close="close" :signalorderData="signalOrder" :dialog="dialog" @delclose="delclose"></Mdialog>

  <div class="ManagePagination">
    <mu-raised-button v-if="nextpage" label="点击加载更多" class="demo-raised-button" @click="moreSearch" :disabled="loading" primary/>
    <mu-raised-button v-else label="已无法获取更多内容" class="demo-raised-button" disabled/>
  </div>

<!--   <mu-dialog :open="dialog2" title="尚未选择要删除的内容" @close="nodelcolse">
    <mu-flat-button slot="actions" primary @click="nodelcolse" label="确定"/>
  </mu-dialog> -->

  <mu-dialog :open="dialog4" title="请输入要查询的内容" @close="nosearch">
    <mu-flat-button slot="actions" primary @click="nosearch" label="确定"/>
  </mu-dialog>

<!--   <mu-dialog :open="dialog3" title="确定要删除吗？" @close="delcolse">
    <p v-for="list in delshopList">订单号：{{ orderData[list]._id }}</p>
    <mu-flat-button slot="actions" @click="delcolse" primary label="取消"/>
    <mu-flat-button slot="actions" primary @click="delOK" secondary label="删除"/>
  </mu-dialog> -->
</div>
</template>

<script>
  import { getVideoData } from '../common/api'
  import Mdialog from "./components/dialog"

  export default {
    data(){
      return {
        searchShop:"",
        searchUser:"",
        loading:true,
        nextpage:true,
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        dialog2:false,   //点击删除却没有选择内容的时候
        dialog3:false,   //取消删除
        dialog4:false,   //没有查询内容
        findorderList:{
          collection:"Order",
          limit:10,//一次获取列表的条数,系统默认为10
          skip:0,//跳过几个数据,系统默认为0
        },
        orderData:[
          // {
            // paymentType:""  //付款方式
            // remark:""  备注
            // price:0   总金额，优惠券前
            // payment:0   实付金额
            // state:"",  订单状态
            // _id:"",   订单id
          // }
        ],
        stateStyle:{
          "已付款":"aleardy",
          "待付款":"wait",
          "已完成":"over",
          "维修中":"doing",
          "已取消":"quit"
        },
        //单个order信息
        signalOrder:{},
        // delshopList:[]//存储要删除Shop的ID
      }
    },
    components: {
      Mdialog
    },
    methods: {
      //获取10条商家内容
      getOrderList (pickData,type){
        this.circleShow = true;
        getVideoData(pickData).then(res => {
          // console.log(res);
          this.listOrderData(res, type)
        },(err => {
          console.log(err)
        }))
      },
      //填入获取到的内容
      inputArr(Arr){
        Arr.time = this.datestr(Arr.createdAt,"yyyy.MM.d hh:mm");

        Arr.id = this.idstr(Arr._id);

        if (Arr.paymentType===0) {
          Arr.paymentTypeW = "在线支付";
        }else if (Arr.paymentType===1){
          Arr.paymentTypeW = "线下支付";
        }else if (Arr.paymentType===2){
          Arr.paymentTypeW = "修好后支付";
        }

        if(this.searchShop!=""){
          Arr.name = Arr.user ? Arr.user.name : "";
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
      //显示商家内容
      listOrderData (Arr,type){
        for(let i in Arr){
          this.inputArr(Arr[i])
        }
        if (type==="增加") {
          if (Arr.length < 10) {
            this.nextpage = false;
          }
          this.orderData = this.orderData.concat(Arr);
        }else{
          this.orderData = Arr;
          this.delshopList = [];
          if (Arr.length < 10) {
            this.nextpage = false;
          }
        }
        this.loading=false;
        this.circleShow = false;
      },    
      //搜索更多
      moreSearch(){
        this.findorderList.limit+=10;
        this.findorderList.skip+=0;
        this.getOrderList(this.findorderList,"增加")
      },
      //搜索
      toSearch(){
        this.loading = true;
        this.findorderList.limit=10;
        this.findorderList.skip=0;
        if (this.searchShop!=="") {
          delete this.findorderList.phone;
          this.findorderList.shop = this.searchShop.replace(/\s/g, "");
          this.getOrderList(this.findorderList)
        }else if(this.searchUser!==""){
          delete this.findorderList.shop;
          this.findorderList.phone = this.searchUser.replace(/\s/g, "");
          this.getOrderList(this.findorderList)
        }else{
          this.dialog4 = true;
        }
        // console.log(this.findorderList)
      },
      //清空
      clearBtn(){
        this.searchShop = "";
        this.searchUser = "";
        this.nextpage = true;
        this.loading = true;
        delete this.findorderList.shopName;
        delete this.findorderList.phone;
        this.orderData = [];
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
          delData[ind] = this.orderData[ind]._id;
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
      open (orderData) {
        this.dialog = true;
        this.signalOrder = orderData;
        // console.log(this.signalOrder);
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalOrder = {};
      },
      delclose(){
        this.getOrderList(this.findorderList)
      },
      nodelcolse(){
        this.dialog2 = false;
      },
      delcolse(){
        this.dialog3 = false;
      },
      nosearch(){
        this.dialog4 = false;
      }
    }
  }
</script>

<style scoped>
  .serchBox{
    position: relative;
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
    margin-left: 10px;
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
  .deleteShopBtn{ 
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
  .aleardy{
    color: #17B978;
  }
  .wait{
    color: #EC7700;
  }
  .over{
    color: #1989AC;
  }
  .doing{
    color: #76A665;
  }
  .quit{
    color: #BBBBBB;
  }
  .tip{
    position: absolute;
    top: 80px;
    color: rgb(126, 87, 194);
  }
</style>