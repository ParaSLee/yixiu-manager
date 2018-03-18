<template>
<div>
  <mu-dialog :open="dialog" @close="close" scrollable>
    <div slot="title" class="titleBox">
      型号详情
      <mu-flat-button label="修改信息" class="demo-flat-button changebtn blueBtn" v-if="!changebtnShow" @click="confirmchange"/>
      <span class="changebtn" v-else>
        <mu-flat-button label="取消" class="demo-flat-button" @click="closeChange"/>
        <mu-flat-button label="确定" class="demo-flat-button blueBtn" @click="changestate"/>
      </span>
      <mu-circular-progress :size="40" v-if="circleShow" class="circleBox changebtn"/>
    </div>
    <p class="dialogBox canchose topItem">
      <span class="messageTitle">型号ID：</span> 
      {{ phoneModelData._id }}
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">手机型号：</span> 
      <span v-if="!changebtnShow">{{ phoneModelData.name }}</span>
      <mu-text-field v-else v-model="newBrandData.name"/>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">别名：</span> 
      <span v-if="!changebtnShow">{{ phoneModelData.alias ? phoneModelData.alias : '无' }}</span>
      <mu-text-field v-else v-model="newBrandData.alias" hintText="(选填)"/>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">型号颜色：</span> 
      <span v-if="!changebtnShow">
        <span v-for="item in phoneModelData.color">{{ item }} </span>
      </span>
      <mu-text-field v-else v-model="newcolor" label="请用1个空格隔开不同颜色"/>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">描述：</span> 
      
      <span v-if="!changebtnShow">{{ phoneModelData.desc ? phoneModelData.desc : '无' }}</span>
      <mu-text-field v-else v-model="newBrandData.desc" hintText="(选填)"/>
    </p>

    <p class="dialogBox">
      <span v-if="!changebtnShow" class="messageTitle">封面：</span> 
      <span v-else class="messageTitle">封面(选填)：</span> 
      <span v-if="!changebtnShow"> 
        <img :src="phoneModelData.cover ? phoneModelData.cover: ''" class="cover" @click="lookImg(phoneModelData.cover)">
      </span>
      
      <span v-else class="photobox"> 
        <img :src="newBrandData.cover" class="cover" @click="lookImg(phoneModelData.cover)">
        <van-uploader :after-read="onRead" accept="image/jpeg,image/png,image/jpg">
          <van-icon name="photograph" />
        </van-uploader>
        <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
      </span>
    </p>

    <p class="dialogBox">
      <span class="messageTitle">型号添加时间：</span> 
      {{ phoneModelData.time }}
    </p>

    <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>

    <mu-flat-button label="删除该型号" class="demo-flat-button delbtn" @click="confirmdel" secondary/>
    <mu-flat-button slot="actions" @click="close" label="关闭"/>
  </mu-dialog>


  <mu-dialog :open="delDialog" title="确定删除？" @close="closedel">
    <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
    <mu-flat-button slot="actions" @click="closedel" primary label="取消"/>
    <mu-flat-button slot="actions" primary @click="delthisbrand" label="确定"/>
  </mu-dialog>
  

</div>
</template>

<script>
import { delPhoneModel,updataPhoneModel } from '../../common/api'
import seebigphoto from "../../common/seeBigPhoto"
import axios from 'axios'
import { Uploader,Icon } from 'vant';

  export default {
    props:{
      phoneModelData:Object,
      dialog:Boolean
    },
    data(){
      return {
        changebtnShow: false, //是否修改
        circleShow:false,  //加载动画
        delDialog: false, //是否删除弹窗
        //保存修改的手机数据
        newBrandData:{
          name:"",
          _id:"",
          color:[],
          alias:"",
          cover:"",
          desc:""
        },
        newcolor:"",
        phonebrand:"",  //手机品牌
        bigImgUrl:"",
      }
    },
    components: {
      seebigphoto,
      [Uploader.name]:Uploader,
      [Icon.name]:Icon,
    },
    methods: {
      //关闭dialog
      close(){
        this.closeChange();
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
        this.circleShow = true;
        let fd = new FormData();
        console.log(file)
        
        fd.append('file', file.file);

        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post('https://yixiu.natappvip.cc/upload', fd, config)
        .then(res => {
          this.newBrandData.cover = res.data.data;
          this.circleShow = false;
        })
      },
      //更新状态
      changestate(){
        this.circleShow = true;
        delete this.newBrandData.id;
        delete this.newBrandData.manufacturer;
        delete this.newBrandData.time;
        delete this.newBrandData.createdAt;
        delete this.newBrandData.updatedAt;
        delete this.newBrandData.__v;

        let colorArr = this.newcolor.split(" ");
        for(let index in colorArr){
          if (colorArr[index]==="") {
            delete colorArr[index]
          }
        }
        this.newBrandData.color = colorArr;
        console.log(this.newBrandData)

        updataPhoneModel(this.newBrandData).then(res => {
          if (res==="更新成功") {
            this.phoneModelData.name = this.newBrandData.name;
            this.phoneModelData.color = this.newBrandData.color;
            this.phoneModelData.cover = this.newBrandData.cover;
            this.phoneModelData.desc = this.newBrandData.desc;
            this.phoneModelData.alias = this.newBrandData.alias;
            this.changebtnShow = false;
            alert("更新成功")
          }else{
            alert("更新失败")
          }
          this.circleShow = false;
        },(err => {
          console.log(err)
        }))
      },
      // 点击修改型号
      confirmchange(){
        this.changebtnShow = true;
        this.newBrandData = this.copy(this.phoneModelData);
        for(let index in this.phoneModelData.color){
          this.newcolor = this.newcolor.concat(`${this.phoneModelData.color[index]} `)
        }
      },
      // 关闭修改型号
      closeChange(){
        this.changebtnShow = false;
        this.newBrandData = {
          name:"",
          _id:"",
          color:[],
        }
        this.newcolor = "";
      },
      //判断是否删除
      confirmdel(){
        this.delDialog = true;
      },
      // 关闭 判断是否删除弹窗
      closedel(){
        this.delDialog = false;
      },
      //删除这个型号
      delthisbrand(){
        this.circleShow = true;
        let delData = {
          _id: this.phoneModelData._id
        }
        delPhoneModel(delData).then(res => {
          this.circleShow = false;
          alert("删除成功")
          location.reload();
        },(err => {
          console.log(err)
        }))
      }
    },
    created(){ 
    }
  }
</script>

<style scoped>
  .blueBtn{
    color: #3379E4;
  }
  .titleBox{
    width: 100%;
  }
  .changebtn{
    float: right;
  }
  .delbtn{
    float: right;
  }
  .canchose{
    -moz-user-select: text;
    -khtml-user-select: text;
    user-select: text;
  }
  .dialogBox{
    font-size: 18px;
    margin-top: 5px;
    padding-bottom: 5px;
    border-bottom: 0.5px solid rgba(153, 153, 153,0.1);
    display: flex;
    align-items: center;
  }
  .photobox{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .dialogBox img{
    max-width: 200px;
    max-height: 200px;
    margin-right: 30px;
  }
  .topItem{
    margin-top: 15px;
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