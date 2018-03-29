<template>
<div>
  <mu-dialog :open="dialog" title="订单详情" @close="close" scrollable>   
  
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="tab1" title="基本信息"/>
      <mu-tab value="tab2" title="用户信息"/>
      <mu-tab value="tab3" title="店铺信息"/>
      <mu-tab value="tab4" title="其他信息"/>
    </mu-tabs>

    <div v-if="activeTab === 'tab1'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">订单ID：</span> 
        {{ questionData._id }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">订单状态：</span> 
        {{ questionData.stateW }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">创建时间：</span> 
        {{ questionData.time }}
      </p>
      <div class="dialogBland2 bottomline"></div>
      <div class="dialogBland2"></div>
      <p class="dialogBox">
        <span class="messageTitle">用户昵称：</span> 
        {{ questionData.user ? questionData.user.name :"无" }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">店铺名称：</span> 
        {{ questionData.user ? questionData.shop.name :"无" }}
      </p>
      <div class="dialogBland2 bottomline"></div>
      <div class="dialogBland2"></div>
      <p class="dialogBox">
        <span class="messageTitle">总金额：</span> 
        {{ questionData.price/100 }} 元
      </p>
      <p class="dialogBox">
        <span class="messageTitle">实付金额：</span> 
        {{ questionData.payment/100 }} 元
      </p>
      <p class="dialogBox">
        <span class="messageTitle">交易方式：</span> 
        {{ questionData.paymentTypeW }}
      </p>
    </div>


    <div v-if="activeTab === 'tab2'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户ID：</span> 
        {{ questionData.user._id }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">用户昵称：</span> 
        {{ questionData.user ? questionData.user.name : "无" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户电话：</span> 
        {{ questionData.user ? questionData.user.mobile : "无" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户邮箱：</span> 
        {{ questionData.user ? questionData.user.email : "无" }}
      </p>
      <div class="dialogBland"></div>
      <div class="dialogBland"></div>
    </div>


    <div v-if="activeTab === 'tab3'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">店铺ID：</span> 
        {{ questionData.shop ? questionData.shop._id : "无" }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">店铺名称：</span> 
        {{ questionData.shop ? questionData.shop.name : "无" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">店铺联系方式：</span> 
        {{ questionData.shop ? questionData.shop.contactNumber : "无" }}
      </p>
      <div class="dialogBland"></div>
    </div>

    <div v-if="activeTab === 'tab4'">
      <div class="dialogBland"></div>
      <p class="dialogBox">
        <span class="messageTitle">服务方式：</span> 
        {{ questionData.serviceWayW }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">手机属性：</span> 
        {{ questionData.phoneModel ? questionData.phoneModel.name : "" }} &nbsp; 
        {{ questionData.phoneModel ? questionData.phoneModel.color[0] : "" }} &nbsp;
      </p>
      <div class="dialogBox">
        <span class="messageTitle">服务内容：</span> 
        <div class="divflexBox">
          <div v-for="serviceOrder in questionData.service" class="divflex">
            <span class="messageTitle">名称：{{ serviceOrder.name }}</span> 
            <span class="messageTitle">金额：{{ serviceOrder.price }} 元</span> 
          </div>
        </div>
        
      </div>
      <div class="dialogBland2 bottomline"></div>
      <div class="dialogBland2"></div>
      <p class="dialogBox">
        <span class="messageTitle">备注：</span> 
        {{ questionData.remark }}
      </p>
    </div>
    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
  </mu-dialog>
</div>
</template>

<script>
import { updateQuestion } from '../../../common/api'
import { Toast } from 'vant';
import seebigphoto from "../../../common/seeBigPhoto"

  export default {
    props:{
      questionData:Object,
      dialog:Boolean
    },
    data(){
      return {
        bigImgUrl:"",
        thephoto:{
          idcarda:"",
          idcardb:"",
          license:"",
          certificate:"",
          protocol:"",
          bigImgUrl:"",
        },
        circleShow:false,
        chosevalue:-1,
        changestateShow:false,
        activeTab: 'tab1',
        question:{
          state: 0,
          _id:"",
        }
      }
    },
    components: {
      seebigphoto
    },
    methods: {
      //查看图片大图
      lookImg(url){
        this.bigImgUrl = url
      },
      //关闭大图查看
      closeimg(){
        this.bigImgUrl = ""
      },
      //关闭dialog
      close(){
        // this.questionData = [];
        this.$emit("close")
      },
      handleTabChange (val) {
        this.activeTab = val
      },
      enterPhoto(){
        if (this.questionData.certificate) {
          for(let ind of this.questionData.certificate){
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
      }
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
    display: flex;
    align-items: center;
  }
  .Textdesc >>> img{
    max-width: 200px;
    max-height: 200px;
  }
  .contentBox{
    border: 4px dotted #E4EDDB;
    padding: 10px;
    font-size: 18px;
    color: #000;
  }
  .Qcontent >>> img{
    display: block;
    margin: 20px auto;
    max-width: 100%;
    max-height: 300px;
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
  .divflexBox{
    width: 80%;
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
  }
  .divflex{
    width: 30%;
    display: flex;
    flex-direction:column;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
  }
  .divflex span{
    width: 100%;
    display: flex;
    flex-direction:row;
    justify-content: flex-start;
  }
  .dialogBland{
    margin-top: 50px;
  }
  .dialogBland2{
    margin-top: 20px;
  }
  .bottomline{
    width: 80%;
    border-bottom: 1px solid rgba(153, 153, 153,0.7);
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
</style>