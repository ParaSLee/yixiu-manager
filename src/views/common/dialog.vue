<template>
<div>
  <mu-dialog :open="dialog" title="商户详情" @close="close" scrollable>   
    <p class="dialogBox canchose">
      <span class="messageTitle">商户ID：</span> 
      {{ shopData._id }}
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户身份证：</span> 
      <span v-if="shopData.certificate && shopData.certificate.length != 0">
        <img :src="shopData.certificate" class="beforeImg" @click="lookImg(shopData.certificate)">
        <img :src="shopData.certificate" class="beforeImg" @click="lookImg(shopData.certificate)">
      </span>
      <span v-else>
        尚未添加
      </span>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">商户名：</span> 
      {{ shopData.name }}
    </p>
    
    <p class="dialogBox">
      <span class="messageTitle">商户封面：</span> 
      <img :src="shopData.cover" class="cover" @click="lookImg(shopData.cover)">
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">商户联系方式：</span> 
      {{ shopData.contactNumber }}
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户创立时间：</span> 
      {{ shopData.time }}
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户证书：</span> 
      <!-- <span>
        <van-uploader :after-read="onRead" accept="image/gif, image/jpeg" multiple>
          <van-icon name="photograph" />
        </van-uploader>
      </span> -->
      <span v-if="shopData.certificate && shopData.certificate.length != 0">
        <img :src="shopData.certificate" class="beforeImg" @click="lookImg(shopData.certificate)">
      </span>
      <span v-else>
        尚未添加
      </span>
    </p>
    <p class="dialogBox">
      <span class="messageTitle">营业执照：</span> 
      <span v-if="shopData.certificate && shopData.certificate.length != 0">
        <img :src="shopData.certificate" class="beforeImg" @click="lookImg(shopData.certificate)">
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
        bigImgUrl:"",
        chosevalue:-1,
        changestateShow:false,
        oldqualificationState:"",
        shop:{
          qualificationState: "待审核",
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
      //传递照片
      onRead(file,content){
        let fd = new FormData();

        let a = {
          name:"certificate",
          data:file.file
        }
        
        fd.append('file', file.file);
        fd.append("_id", this.shopData._id);

        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        console.log(fd.get('_id'))
        axios.post('https://yixiu.natappvip.cc/upload/shop/certificate/', fd, config)
        .then(res => {
          console.log(res);
        })
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
      //更新状态
      changestate(){
        if(this.chosevalue===false){
          alert("尚未选择");
        }else if (this.shop.qualificationState == this.chosevalue) {
          alert("没有改变状态")
        }else{
          this.shop.qualificationState = this.chosevalue;
          this.shop._id = this.shopData._id;
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
      }
    },
    created(){ 
      this.chosevalue = this.shopData.qualificationState;
      this.shop.qualificationState = this.chosevalue;
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
</style>