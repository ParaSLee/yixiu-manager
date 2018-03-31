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
        {{ signalorderData._id }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">订单状态：</span> 
        {{ signalorderData.stateW }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">创建时间：</span> 
        {{ signalorderData.time }}
      </p>
      <div class="dialogBland2 bottomline"></div>
      <div class="dialogBland2"></div>
      <p class="dialogBox">
        <span class="messageTitle">用户昵称：</span> 
        {{ signalorderData.user ? signalorderData.user.name :"无" }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">店铺名称：</span> 
        {{ signalorderData.user ? signalorderData.shop.name :"无" }}
      </p>
      <div class="dialogBland2 bottomline"></div>
      <div class="dialogBland2"></div>
      <p class="dialogBox">
        <span class="messageTitle">总金额：</span> 
        {{ signalorderData.price/100 }} 元
      </p>
      <p class="dialogBox">
        <span class="messageTitle">实付金额：</span> 
        {{ signalorderData.payment/100 }} 元
      </p>
      <p class="dialogBox">
        <span class="messageTitle">交易方式：</span> 
        {{ signalorderData.paymentTypeW }}
      </p>
    </div>


    <div v-if="activeTab === 'tab2'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户ID：</span> 
        {{ signalorderData.user ? signalorderData.user._id : "" }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">用户昵称：</span> 
        {{ signalorderData.user ? signalorderData.user.name : "未填写" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户地址：</span> 
        {{ signalorderData.address ? signalorderData.address : "未填写" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户电话：</span> 
        {{ signalorderData.user ? signalorderData.user.mobile : "未填写" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户邮箱：</span> 
        {{ signalorderData.user ? signalorderData.user.email : "未填写" }}
      </p>
      <div class="dialogBland"></div>
      <div class="dialogBland"></div>
    </div>


    <div v-if="activeTab === 'tab3'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">店铺ID：</span> 
        {{ signalorderData.shop ? signalorderData.shop._id : "无" }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">店铺名称：</span> 
        {{ signalorderData.shop ? signalorderData.shop.name : "无" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">店铺联系方式：</span> 
        {{ signalorderData.shop ? signalorderData.shop.contactNumber : "无" }}
      </p>
      <div class="dialogBland"></div>
    </div>

    <div v-if="activeTab === 'tab4'">
      <div class="dialogBland"></div>
      <p class="dialogBox">
        <span class="messageTitle">服务方式：</span> 
        {{ signalorderData.serviceWay }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">手机属性：</span> 
        {{ signalorderData.phoneModel ? signalorderData.phoneModel.name : "" }} &nbsp; 
        {{ signalorderData.phoneModel ? signalorderData.phoneModel.color[0] : "" }} &nbsp;
      </p>
      <div class="dialogBox">
        <span class="messageTitle">服务内容：</span> 
        <div v-for="serviceOrder in signalorderData.service" class="divflex">
          <span class="messageTitle">名称：{{ serviceOrder.name }}</span> 
          <span class="messageTitle">金额：{{ serviceOrder.price }} 元</span> 
        </div>
      </div>
      <div class="dialogBland2 bottomline"></div>
      <div class="dialogBland2"></div>
      <p class="dialogBox">
        <span class="messageTitle">备注：</span> 
        {{ signalorderData.remark }}
      </p>
    </div>
    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
  </mu-dialog>
</div>
</template>

<script>
  export default {
    props:{
      signalorderData:Object,
      dialog:Boolean
    },
    data(){
      return {
        activeTab: 'tab1'
      }
    },
    components: {
    },
    methods: {
      //关闭dialog
      close(){
        // this.signalorderData = [];
        this.$emit("close")
      },
      handleTabChange (val) {
        this.activeTab = val
      }
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
  .divflex{
    width: 80%;
    display: flex;
    flex-direction:column;
    justify-content: flex-start;
    align-items: center;
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
</style>