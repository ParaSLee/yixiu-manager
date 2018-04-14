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
    <p class="dialogBox">
      <span class="messageTitle">缴纳押金：</span> 
      {{ shopData.payment || shopData.payment!=0 ? `${shopData.payment/100} 元` : "尚未缴纳" }}
    </p>
    
    <p class="dialogBox">
      <span class="messageTitle">商户封面：</span> 
      <img :src="shopData.cover" class="cover" @click="lookImg(shopData.cover)">
    </p>
    
    <p class="dialogBox">
      <span class="messageTitle">商户创立时间：</span> 
      {{ shopData.time }}
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
    
    <p class="dialogBox checkBox">
      <span class="messageTitle">商户状态：</span> 
      <span v-if="!changestateShow">
        <span v-if="shopData.qualificationState==='待审核'" class="wait">待审核</span>
        <span v-else-if="shopData.qualificationState==='未通过'" class="unpass">未通过</span>
        <span v-else-if="shopData.qualificationState==='正常'" class="normal">正常</span>
        <mu-flat-button label="修改状态" class="demo-flat-button changestateBtn" @click="chosestate" />
      </span>
      <span v-else class="changestateBox">
        <mu-radio label="未通过" name="group" nativeValue="未通过" v-model="chosevalue" class="demo-radio"/>
        <mu-radio label="正常" name="group" nativeValue="正常" v-model="chosevalue" class="demo-radio"/>
        
        <mu-raised-button label="取消" class="demo-raised-button" @click="closechosestate" />
        <mu-raised-button label="更新" class="demo-raised-button" @click="changestate" primary/>
      </span>
    </p>

    <p class="dialogBox checkBox">
      <span class="messageTitle">销售权限：</span> 
      <span v-if="!changesellShow">
        <span v-if="shopData.sellPhone===true" class="normal">可销售</span>
        <span v-else class="unpass">不可销售</span>
        <mu-flat-button 
          label="修改权限" 
          class="demo-flat-button changestateBtn" 
          @click="chosesell" 
          :disabled="shopData.qualificationState==='未通过' || shopData.qualificationState==='待审核'"
        />
        <span class="tig">只有能正常运营的店铺能修改销售权限</span>
      </span>
      <span v-else class="changestateBox">
        <mu-radio label="不可销售" name="group" nativeValue="不可销售" v-model="chosesellValue" class="demo-radio"/>
        <mu-radio label="可销售" name="group" nativeValue="可销售" v-model="chosesellValue" class="demo-radio"/>
        
        <mu-raised-button label="取消" class="demo-raised-button" @click="closechosesell" />
        <mu-raised-button label="更新" class="demo-raised-button" @click="changesell" primary/>
      </span>
    </p>
    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
    <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>
  </mu-dialog>

  

</div>
</template>

<script>
import { Uploader, Icon } from 'vant';
import { changeState } from './api'
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
        }
      }
    },
    components: {
      [Uploader.name]: Uploader,
      [Icon.name]: Icon,
      seebigphoto
    },
    methods: {
      //关闭dialog
      close(){
        this.changestateShow = false;
        this.chosevalue = -1;
        this.$emit("close")
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
          console.log(this.shop)
          changeState(this.shop).then(res => {
            console.log(res)
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
        console.log(this.shop)
        changeState(this.shop).then(res => {
          console.log(res)
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
      }
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
</style>