<template>
<div>
  <mu-dialog :open="dialog" title="商铺详情" @close="close" scrollable>   
  
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="tab1" title="商铺信息"/>
      <mu-tab value="tab2" title="证件详情"/>
      <mu-tab value="tab3" title="订单信息"/>
      <mu-tab value="tab4" title="其他信息"/>
    </mu-tabs>

    <div v-if="activeTab === 'tab1'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">商铺ID：</span> 
        {{ questionData._id }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">商铺名：</span> 
        {{ questionData.name }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">创建时间：</span> 
        {{ questionData.time }}
      </p>
      <div class="dialogBland2 bottomline"></div>
      <div class="dialogBland2"></div>
      <div class="dialogBox canchose">
        <span class="messageTitle">联系方式：</span> 
        {{ questionData.contactNumber }}
      </div>
      <div class="dialogBox canchose">
        <span class="messageTitle">商铺地址：</span> 
        {{ questionData.address }}
      </div>
    </div>


    <div v-if="activeTab === 'tab2'">
      <div class="dialogBland"></div>
      <p class="dialogBox">
        <span class="messageTitle">缴纳押金：</span> 
        {{ questionData.payment || questionData.payment!=0 ? `${questionData.payment/100} 元` : "尚未缴纳" }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">商户身份证：</span> 
        <span v-if="thephoto.idcarda && thephoto.idcarda.length != 0">
          <img :src="thephoto.idcarda" class="beforeImg" @click="lookImg(thephoto.idcarda)">
          <img :src="thephoto.idcardb" class="beforeImg" @click="lookImg(thephoto.idcardb)">
        </span>
        <span v-else>
          尚未添加
        </span>
      </p>
      <p class="dialogBox">
        <span class="messageTitle">商户证书：</span> 
        <!-- <span>
          <van-uploader :after-read="onRead" accept="image/gif, image/jpeg" multiple>
            <van-icon name="photograph" />
          </van-uploader>
        </span> -->
        <span v-if="thephoto.certificate && thephoto.certificate.length != 0">
          <img :src="thephoto.certificate" class="beforeImg" @click="lookImg(thephoto.certificate)">
        </span>
        <span v-else>
          尚未添加
        </span>
      </p>
      <p class="dialogBox">
        <span class="messageTitle">营业执照：</span> 
        <span v-if="thephoto.certificate && thephoto.certificate.length != 0">
          <img :src="thephoto.certificate" class="beforeImg" @click="lookImg(thephoto.certificate)">
        </span>
        <span v-else>
          尚未添加
        </span>
      </p>
    </div>
     <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>

    <div v-if="activeTab === 'tab3'">
      <div class="dialogBland"></div>
      <p class="dialogBox">
        <span class="messageTitle">订单总数：</span> 
        {{ questionData.orderlist?questionData.orderlist.length : "0" }} 个
      </p>
      <p class="dialogBox">
        <span class="messageTitle">总金额：</span> 
        {{ questionData.allmoney?questionData.allmoney: "0" }} 元
      </p>
    </div>

    <div v-if="activeTab === 'tab4'">
      <div class="dialogBland"></div>
      <p class="dialogBox">
        <span class="messageTitle">营业时间：</span> 
        {{ questionData.businessHours[0] }}
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