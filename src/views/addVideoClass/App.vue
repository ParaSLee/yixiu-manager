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
    <div class="ItemBox">
      <span>试看视频：</span>
      <div class="ItemText">
        <mu-raised-button v-if="hasVideo" label="查看视频" class="demo-raised-button videoBtn" primary @click="seeVideo"/>
        <van-uploader class="upimg2" :after-read="onVideoRead" accept="video/*">
          <van-icon name="photograph" />
        </van-uploader>
        <mu-linear-progress v-if="VideocircleShow" mode="determinate" :value="uploading" color="rgb(33, 150, 243)"/>
      </div>
      <p class="tagTip">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可选</p>
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
      <span>推荐学习时间：</span>
      <div class="ItemText">
        <mu-text-field 
          class="tags"
          hintText="请输入整数" 
          errorText="必填项，且只能输入数字" 
          v-if="errTipShow.errtime"
          v-model="newClass.info.time"
        />
        <mu-text-field hintText="请输入数字" class="tags" v-model="newClass.info.time" v-else/>&nbsp;小时<br/>
      </div>
    </div>
    
    <div class="ItemBox">
      <span>价&nbsp;&nbsp;&nbsp;格：</span>
      <div class="ItemText">
        <mu-text-field 
          class="tags"
          hintText="请输入价格" 
          errorText="必填项，且只能输入数字" 
          v-if="errTipShow.errprice"
          v-model="price"
        />
        <mu-text-field hintText="请输入价格" class="tags" v-model="price" v-else/>&nbsp;元<br/>
      </div>
    </div>
  </div>
  
  <mu-raised-button v-if="updata" label="更新" class="demo-raised-button" primary @click="upNewClass"/>
  
  <mu-raised-button v-else label="提交" class="demo-raised-button" primary @click="addNewClass"/>
  
  <mu-circular-progress :size="40" v-if="upcircleShow" class="circleBox"/>
  <mu-dialog :open="okdialog" @close="close">
    提交成功！
    <mu-flat-button slot="actions" primary @click="close" label="确定"/>
  </mu-dialog>
</div>
</template>

<script>
  import { addVideoData,upVideoData } from '../common/api'
  import { Uploader,Icon } from 'vant';
  import seebigphoto from "../common/seeBigPhoto";
  import axios from 'axios';

  export default {
    data(){
      return {
        hasVideo:false,
        updata:false,
        price:null,
        newClass:{
          collection:"Train",//固定参数
          name:"",//培训课程名称
          desc:"",//描述
          tag:[],//标签
          type:"",//分类
          level:"0",//级别
          info:{  //详情,是一个对象,里面数据结构可自行组织
            cover:"",   //存储课程封面
            video:"",   //存储试看视频地址
            time:"",    //推荐学习时间
          },
          price:null //价格 上传需要单位：分
        },
        bigImgUrl:"",
        circleShow:false,  //加载动画
        VideocircleShow:false,
        uploading:0,
        upcircleShow:false,
        okdialog:false,
        errTipShow:{
          errname:false,
          errdesc:false,
          errprice:false,
          errcover:false,
          errtime:false
        },
      }
    },
    components: {
      seebigphoto,
      [Uploader.name]:Uploader,
      [Icon.name]:Icon,
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
        }else if(isNaN(this.price)){
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
        if (this.newClass.info.time==="") {
          this.errTipShow.errtime = true;
          iserr = true;
          this.upcircleShow = false;
        }else if(isNaN(this.newClass.info.time)){
          this.errTipShow.errtime = true;
          iserr = true;
          this.upcircleShow = false;
        }


        // console.log(this.newClass)
        if (iserr === false) {
          addVideoData(this.newClass).then(res => {
            // console.log(res)
            this.okdialog = true;
          },(err => {
            console.log(err)
          }))
        }
      },
      upNewClass(){
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
        }else if(isNaN(this.price)){
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
        if (this.newClass.info.time==="") {
          this.errTipShow.errtime = true;
          iserr = true;
          this.upcircleShow = false;
        }else if(isNaN(this.newClass.info.time)){
          this.errTipShow.errtime = true;
          iserr = true;
          this.upcircleShow = false;
        }
        
        // console.log(pushData)

        if (iserr === false) {
          let pushData = {
            collection:"Train",
            find:{
              _id:this.newClass._id
            },
            update:{
              desc:this.newClass.desc,
              name:this.newClass.name,
              price:this.newClass.price,
              tag:this.newClass.tag,
              level:this.newClass.level,
              info:this.newClass.info,
              type:this.newClass.type,
            }
          }
          
          upVideoData(pushData).then(res => {
            // console.log(res)
            if (res == "更新成功") {
              this.okdialog = true;
            }
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
        // console.log(file)
        
        fd.append('file', file.file);

        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post('https://m.yixiutech.com/upload2', fd, config)
        .then(res => {
          // console.log(res)
          this.newClass.info.cover = res.data.data;
          this.circleShow = false;
        })
      },
      onVideoRead(file,content){
        this.VideocircleShow = true;
        let fd = new FormData();
        
        fd.append('file', file.file);

        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.hasVideo = false;
        
        this.timer = setInterval(() => {
          this.uploading += 1
          if (this.uploading >= 80) clearInterval(this.timer);
        }, 3000)
        axios.post('https://m.yixiutech.com/upload', fd, config)
        .then(res => {
          clearInterval(this.timer)
          this.timer2 = setInterval(() => {
            this.uploading += 3
            if (this.uploading >= 100) {
              clearInterval(this.timer2)
              this.showVideo(res)
            };
          }, 100)
        })
      },
      showVideo(res){
        // console.log(res)
        this.newClass.info.video = res.data.data;
        this.hasVideo = true;
      },
      seeVideo(){
        window.open(this.newClass.info.video, '_blank');
      }
    },
    created(){
      if (this.$route.params.data) {
        let classData = this.$route.params.data;
        this.newClass = classData;
        this.price = classData.price/100;
        this.updata = true;
      }
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
  }
  .upimg{
    margin-top: 10px;
    margin-left: 20px;
  }
  .upimg2{
    margin-top: 10px;
    margin-left: 8px;
  }
  .circleBox{
    margin-left: 20px;
  }
  .errTip{
    color: #FF6138;
    font-size: 14px;
    margin-left: 5px;
  }
  .videoBtn{
    margin-bottom: 10px;
  }
</style>