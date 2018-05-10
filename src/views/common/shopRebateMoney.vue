<template>
<div>
  <mu-dialog :open="dialog" title="商户详情" @close="close" scrollable>   
    <p class="dialogBox canchose">
      <span class="messageTitle">商户ID：</span> 
      {{ shopData._id }}
    </p>
    
    <p class="dialogBox canchose">
      <span class="messageTitle">商户名：</span> 
      {{ shopData.name }}
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">商户联系方式：</span> 
      {{ shopData.contactNumber }}
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">商户地址：</span> 
      {{ shopData.address ? shopData.address : "尚未填写地址" }}
    </p>
    <div class="dialogBox canchose">
      <span class="messageTitle">邀请商家：</span> 
      {{ shopnumber }}户
    </div>
    <p class="dialogBox canchose">
      <span class="messageTitle">总返利：</span> 
      {{ allnumber }}元
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">已返利：</span> 
      {{ surplusnumber }}元
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">待返利：</span> 
      {{ allnumber-surplusnumber }}元
    </p>
    <div class="search">
      <button @click="serchmoney (shopData)">查询</button>
    </div>

    <mu-flat-button slot="actions" @click="closeRebate" primary label="关闭"/>

    <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>
  </mu-dialog>

  

</div>
</template>

<script>
import { Uploader, Icon, Button } from 'vant';
import { changeState,delVideoData } from './api'
import seebigphoto from "./seeBigPhoto"
import axios from 'axios'

  export default {
    props:{
      shopData:Object,
      dialog:Boolean
    },
    data(){
      return {
        thephoto:{
          idcarda:"",
          idcardb:"",
          license:"",
          certificate:"",
          protocol:"",
          bigImgUrl:"",
        },
        shopnumber: 0,
        allnumber: 0,
        surplusnumber: 0,
        userlist: [],
        allUserIds: [],
        bigImgUrl:"",
        chosevalue:-1,
        chosesellValue:"不可销售",
        changestateShow:false,
        changesellShow:false,
        oldqualificationState:"",
        oldqualificationSell:"",
        shop:{
          qualificationState: "待审核",
          sellPhone:false,
          _id:"",
        },
        findorderList:{
          collection:"Shop",
          _id:"",
        },
        deldialog:false,
        deldialog2:false,
      }
    },
    components: {
      [Uploader.name]: Uploader,
      [Icon.name]: Icon,
      seebigphoto,
      [Button.name]: Button,
    },
    methods: {
      //关闭dialog
      closeRebate(){
        this.shopnumber = 0,
        this.allnumber = 0,
        this.surplusnumber = 0,
        this.$emit("closeRebate")
      },
      
      async serchmoney (shopData) {
        console.log("-------------");
        let shopId = shopData._id;
        // let shopId = '5ae17c86e3c2bf043444890a';
        let shopList = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
            collection:'Shop',
            parent: shopId,
            limit: 0,
            select:{_id:1},
		    })
        console.log(shopList);

        // alert("已推荐" + shopList.length + "人");
        // let shopLists = shopList.data;
        // console.log(shopLists);
        // alert("已推荐" + "人");
        this.shopnumber = shopList.length;
        
        let shopids = [];

        if(shopList.length>0){
          for(var x= 0; x<shopList.length; x++){
            console.log(shopList[x]._id);
            shopids.push(shopList[x]._id);
          }
        }
        this.allShopIds = shopids;
        //订单查询
        let shopOrderList = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
            collection:'Order',
            shop: {
                $in:shopids,
            },
            limit: 0,
            select:{payment:1},
		    })
        console.log("--------------------------2");
        console.log(shopOrderList);
        let shopOrderLists = shopOrderList.data;
        let sumMoney = 0;
        if(shopOrderList.length>0){
          for(var y= 0; y<shopOrderList.length; y++){
            sumMoney = sumMoney + shopOrderList[y].payment;
           }
        }
        console.log("--------------------------3");
        console.log(sumMoney);
        this.allnumber = (sumMoney/100)*0.02;
        console.log(this.allnumber);
        console.log("--------------------------------------------------------------------");
        let shopOrderListHadGet = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
            collection:'Order',
            shop: {
                $in:shopids,
            },
            limit: 0,
            select:{payment:1},
		    })
        console.log("--------------------------2");
        console.log(shopOrderList);
        let shopOrderListHadGets = shopOrderListHadGet.data;
        let sum = 0;
        if(shopOrderListHadGet.length>0){
          for(var y= 0; y<shopOrderListHadGet.length; y++){
            sum = sum + shopOrderListHadGet[y].payment;
           }
        }
        console.log("--------------------------4");
        console.log(sum);
        this.surplusnumber = (sum/100)*0.02;
        console.log(this.surplusnumber);
      },
      //查看图片大图
      lookImg(url){
        this.bigImgUrl = url
      },
      //关闭大图查看
      closeimg(){
        this.bigImgUrl = ""
      },
      //改变状态
      chosestate(){
        this.changestateShow = true;
        this.oldqualificationState = this.shop.qualificationState
      },
      //关闭更改状态
      closechosestate(){
        this.changestateShow = false;
        this.chosevalue = -1;
        this.shop.qualificationState = this.oldqualificationState;
      },
      chosesell(){
        this.changesellShow = true;
        this.oldqualificationSell = this.shop.sellPhone === true ? true : false;
        this.chosesellValue = this.shop.sellPhone===true ? "可销售" : "不可销售";
      },
      closechosesell(){
        this.changesellShow = false;
        this.chosesellValue = "不可销售";
        this.shop.sellPhone = this.oldqualificationSell;
      },
      //更新状态
      changestate(){
        if(this.chosevalue===false){
          alert("尚未选择");
        }else if (this.shop.qualificationState == this.chosevalue) {
          alert("没有改变状态")
        }else{
          delete this.shop.sellPhone;
          this.shop.qualificationState = this.chosevalue;
          this.shop._id = this.shopData._id;
          if (this.shop.qualificationState=="正常") {
            this.shop.qualification = true;
          }else{
            this.shop.qualification = false;
          }
          // console.log(this.shop)
          changeState(this.shop).then(res => {
            // console.log(res)
            this.changestateShow = false;
            this.shopData.qualificationState = res.qualificationState
          },(err => {
            console.log(err)
          }))
        }
        
        // changeState()
      },
      changesell(){
        this.shop.sellPhone = this.chosesellValue==="可销售"? true : false;
        this.shop._id = this.shopData._id;
        delete this.shop.qualificationState;
        // console.log(this.shop)
        changeState(this.shop).then(res => {
          // console.log(res)
          this.changesellShow = false;
          this.shopData.sellPhone = res.sellPhone
        },(err => {
          console.log(err)
        }))
      },
      enterPhoto(){
        if (this.shopData.certificate) {
          for(let ind of this.shopData.certificate){
            if (ind.name=="idcard1") {
              this.thephoto.idcarda = ind.src
            }else if(ind.name=="idcard2"){
              this.thephoto.idcardb = ind.src
            }else if(ind.name=="license"){
              this.thephoto.license = ind.src
            }else if(ind.name=="certificate"){
              this.thephoto.certificate = ind.src
            }else if(ind.name=="protocol"){
              this.thephoto.protocol = ind.src
            }
          }
        }
      },
      deldia(){
        this.deldialog = true;
      },
      closedel(){
        this.deldialog = false;
      },
      delClass(){
        this.circleShow = true;
        this.findorderList._id = this.shopData._id;

        delVideoData(this.findorderList).then(res => {
          this.circleShow = false;
          this.deldialog2 = true;
        },(err => {
          console.log(err)
        }))
      },
      closeAll(){
        this.deldialog2 = false;
        this.closedel();
        this.close();
        this.$emit("delclose")
      },
    },
    created(){
      this.chosevalue = this.shopData.qualificationState;
      this.shop.qualificationState = this.chosevalue;
    },
    updated(){
      this.enterPhoto();
    }
  }
</script>

<style scoped>
  .canchose{
    -moz-user-select: text;
    -khtml-user-select: text;
    user-select: text;
  }
  .dialogBox{
    font-size: 18px;
    margin-bottom: 5px;
    padding-bottom: 5px;
    border-bottom: 0.5px solid rgba(153, 153, 153,0.1);

    display: flex;
    align-items: center;

  }
  .messageTitle{
    display: inline-block;
    text-align: right;
    width: 126px;
    margin-right: 5px;
  }
  .cover{
    max-width: 200px;
    max-height: 200px; 
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
  .changestateBtn{
    margin-left: 10px;
  }
  .checkBox{
    display: flex;
    align-items: center;
  }
  .changestateBox{
    display: flex;
    align-items: center;
  }
  .changestateBox label{
    margin-right: 10px;
  }
  .changestateBox button{
    margin-left: 10px;
  }
  .beforeImg{
    max-width: 240px;
    max-height: 240px;
  }
  .tig{
    color: #FF6138;
    font-size: 14px;
  }
  .search{
    align-items: center;
  }
</style>