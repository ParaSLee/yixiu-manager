<template>
<div>
  <div class="serchBox">
    <mu-raised-button label="返回"  class="addBtn" @click="prepage" />
  </div>
  <div class="line"></div>
  <div class="addbody">
    <div class="ItemBox">
      <span>课程名：</span> 
      <div class="ItemText">
        <mu-text-field 
          fullWidth 
          hintText="请输入课程名" 
          errorText="这是必填项" 
          v-if="errTipShow.errname"
          v-model="newClass.name"
        />
        <mu-text-field fullWidth hintText="请输入课程名" v-model="newClass.name" v-else/><br/>
      </div>
    </div>
    <div class="ItemBox">
      <span>等&nbsp;&nbsp;&nbsp;级：</span>
      <div class="ItemText">
        <mu-select-field v-model="newClass.level">
          <mu-menu-item value="0" title="初级"/>
          <mu-menu-item value="1" title="中级"/>
          <mu-menu-item value="2" title="高级"/>
        </mu-select-field>
      </div>
    </div>
    <div class="ItemBox">
      <span>封&nbsp;&nbsp;&nbsp;面：</span>
      <div class="ItemText">
        <img :src="newClass.info.cover" class="cover" @click="lookImg(newClass.info.cover)">
        <van-uploader class="upimg" :after-read="onRead" accept="image/jpeg,image/png,image/jpg">
          <van-icon name="photograph" />
        </van-uploader>
        <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
      </div>
    </div>
    <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>
    <div class="ItemBox">
      <span>标&nbsp;&nbsp;&nbsp;签：</span>
      <div class="tagsBox">
        <mu-text-field class="tags" hintText="标签" v-model="newClass.tag[0]"/>
        <mu-text-field class="tags" hintText="标签" v-model="newClass.tag[1]"/>
        <mu-text-field class="tags" hintText="标签" v-model="newClass.tag[2]"/>
        <mu-text-field class="tags" hintText="标签" v-model="newClass.tag[3]"/>
        <mu-text-field class="tags" hintText="标签" v-model="newClass.tag[4]"/>
      </div>
      <p class="tagTip">选填，最多5个</p>
    </div>
    <div class="ItemBoxM">
      <div class="ItemBox ItemBoxM">
        <span>描&nbsp;&nbsp;&nbsp;述：</span>
        <div class="ItemText">
          <mu-text-field 
            hintText="请输入描述" 
            fullWidth 
            multiLine 
            :rows="3" 
            :rowsMax="6" 
            v-model="newClass.desc"
            errorText="这是必填项" 
            v-if="errTipShow.errdesc"
          />
          <mu-text-field hintText="请输入描述" fullWidth multiLine :rows="3" :rowsMax="6" v-model="newClass.desc" v-else/><br/>
        </div>
      </div>
    </div>
    
    <div class="ItemBox">
      <span>价&nbsp;&nbsp;&nbsp;格：</span>
      <div class="ItemText">
        <mu-text-field 
          class="tags"
          hintText="请输入价格" 
          errorText="这是必填项" 
          v-if="errTipShow.errprice"
          v-model="price"
        />
        <mu-text-field hintText="请输入价格" class="tags" v-model="price" v-else/>&nbsp;元<br/>
      </div>
    </div>
  </div>
  
  <mu-raised-button label="提交" class="demo-raised-button" primary @click="addNewClass"/>
  <mu-circular-progress :size="40" v-if="upcircleShow" class="circleBox"/>
  <mu-dialog :open="okdialog" @close="close">
    提交成功！
    <mu-flat-button slot="actions" primary @click="close" label="确定"/>
  </mu-dialog>
</div>
</template>

<script>
  import { addVideoData } from '../common/api'
  import { Uploader,Icon,Toast } from 'vant';
  import seebigphoto from "../common/seeBigPhoto";
  import axios from 'axios';

  export default {
    data(){
      return {
        price:null,
        newClass:{
          collection:"Train",//固定参数
          name:"",//培训课程名称
          desc:"",//描述
          tag:[],//标签
          type:"",//分类
          level:"0",//级别
          info:{  //详情,是一个对象,里面数据结构可自行组织
            cover:""
          },
          price:null //价格 上传需要单位：分
        },
        bigImgUrl:"",
        circleShow:false,  //加载动画
        upcircleShow:false,
        okdialog:false,
        errTipShow:{
          errname:false,
          errdesc:false,
          errprice:false,
          errcover:false
        },
      }
    },
    components: {
      seebigphoto,
      [Uploader.name]:Uploader,
      [Icon.name]:Icon,
      [Toast.name]:Toast,
    },
    methods: {
      addNewClass (){
        this.upcircleShow = true;
        for(let i in this.errTipShow){
          this.errTipShow[i] = false;
        }

        let iserr = false;
        
        if (this.newClass.name==="") {
          this.errTipShow.errname = true;
          iserr = true;
          this.upcircleShow = false;
        }
        if (this.newClass.desc==="") {
          this.errTipShow.errdesc = true;
          iserr = true;
          this.upcircleShow = false;
        }
        if (this.price===null) {
          this.errTipShow.errprice = true;
          iserr = true;
          this.upcircleShow = false;
        }else{
          this.newClass.price = this.price*100;
        }
        if (this.newClass.info.cover===null) {
          this.errTipShow.errcover = true;
          iserr = true;
          this.upcircleShow = false;
        }

        console.log(this.newClass)
        if (iserr === false) {
          addVideoData(this.newClass).then(res => {
            console.log(res)
            this.okdialog = true;
          },(err => {
            console.log(err)
          }))
        }
      },
      close () {
        this.dialog = false;
        this.$router.push({ path: '/home/videoClass'})
      },
      prepage(){
        this.$router.go(-1)
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
          this.newClass.info.cover = res.data.data;
          this.circleShow = false;
        })
      },
    }
  }
</script>

<style scoped>
  .serchBox{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .line{
    width: 100%;
    height: 1px;
    padding-left: -10px;
    padding-right: -10px;
    background-image: linear-gradient(120deg, #ebedee 0%, #fdfbfb 100%);
    margin-top: 25px;
  }
  .addbody{
    margin-top: 20px;
  }
  .ItemBox{
    position: relative;
    display: flex;
    align-items: top;
    margin-bottom: 20px;

  }
  .ItemBoxM{
    overflow: hidden;
    margin-top: 15px;
  }
  .ItemText{
    display: inline-block;
    max-width: 80%; 
    min-width: 60%;
    min-height: 56px;
    font-size: 18px;
  }
  .addbody span{
    display: inline-block;
    font-size: 18px;
    margin-right: 10px;
    min-width: 72px;
    text-align: right;
    margin-top: 10px;
  }
  .tags{
    width: 150px;
    margin-right: 20px;
  }
  .tagTip{
    position: absolute;
    top: 40px;
    left: -30px;
    color: rgb(126, 87, 194);
  }
  .cover{
    max-width: 150px;
    max-height: 150px; 
    margin-right: 20px;
  }
  .upimg{
    margin-top: 10px;
  }
  .circleBox{
    margin-left: 20px;
  }
  .errTip{
    color: #FF6138;
    font-size: 14px;
    margin-left: 5px;
    /*margin-top: 5px;*/
  }
</style>