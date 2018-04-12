<template>
<div>
  <div class="serchBox">
    <mu-raised-button label="返回"  class="addBtn" @click="prepage" />
  </div>
  <div class="line"></div>
  <div class="addbody">
    <div class="ItemBox">
      <span>所属课程：</span> 
      <div class="ItemText">
        <mu-text-field fullWidth hintText="请输入课程名" v-model="ClassData.name" disabled/><br/>
      </div>
    </div>
    <div class="ItemBox">
      <span>所属章节：</span>
      <div class="ItemText">
        <mu-select-field v-model="newClass.index">
          <mu-menu-item v-for="item in CourseData" :key="item.index" :value="item.index" :title="`${item.index}. ${item.name}`"/>
        </mu-select-field>
      </div>
    </div>
    <div class="ItemBox">
      <span>视频名：</span> 
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
      <span>视&nbsp;&nbsp;&nbsp;频：</span>
      <div class="ItemText">
        <mu-raised-button v-if="hasVideo" label="查看视频" class="demo-raised-button videoBtn" primary @click="seeVideo"/>
        <van-uploader class="upimg" :after-read="onRead" accept="video/*">
          <van-icon name="photograph" />
        </van-uploader>
        <mu-linear-progress v-if="circleShow" mode="determinate" :value="uploading" color="rgb(33, 150, 243)"/>
      </div>
      <p class="tagTip" v-if="errTipShow.errurl">必须上传视频</p>
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
  import axios from 'axios';

  export default {
    data(){
      return {
        updata:false,
        uploading:0,
        ClassData:{},
        CourseData:[],
        price:null,
        newClass:{
          collection:"TrainVideo",//固定参数
          index:1,//索引
          name:"",//培训课程名称
          desc:"",//描述
          url:"",//视频地址
          info:{},
          train:{
            _id:""
          },
          trainChapter:{
            _id:""
          }
        },
        circleShow:false,  //加载动画
        upcircleShow:false,
        okdialog:false,
        hasVideo:false,
        errTipShow:{
          errname:false,
          errdesc:false,
          errurl:false,
        },
      }
    },
    components: {
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
        if (this.newClass.url==="") {
          this.errTipShow.errurl = true;
          iserr = true;
          this.upcircleShow = false;
        }

        
        if (iserr === false) {
          this.newClass.train._id = this.ClassData.id;
          for(let i of this.CourseData){
            if (i.index === this.newClass.index ) {
              this.newClass.trainChapter._id = i._id;
              break;
            }
          }
          addVideoData(this.newClass).then(res => {
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
        if (this.newClass.url==="") {
          this.errTipShow.errurl = true;
          iserr = true;
          this.upcircleShow = false;
        }

        
        // console.log(pushData)

        if (iserr === false) {
          for(let i of this.CourseData){
            if (i.index === this.newClass.index ) {
              this.newClass.trainChapter = i._id;
              this.newClass.index = i.index;
              break;
            }
          }

          let pushData = {
            collection:"TrainVideo",
            find:{
              _id:this.newClass._id
            },
            update:{
              desc:this.newClass.desc,
              name:this.newClass.name,
              url:this.newClass.url,
              index:this.newClass.index,
              trainChapter:{
                _id:this.newClass.trainChapter
              },
            }
          }

          // console.log(pushData)

          upVideoData(pushData).then(res => {
            // console.log(res)
            this.okdialog = true;
          },(err => {
            console.log(err)
          }))
        }
      },
      close () {
        this.dialog = false;
        this.$router.push({ path: '/home/videosManage'})
      },
      prepage(){
        this.$router.push({ path: '/home/videosManage'})
      },
      //传递照片
      onRead(file,content){
        this.circleShow = true;
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
        this.newClass.url = res.data.data;
        this.hasVideo = true;
      },
      seeVideo(){
        window.open(this.newClass.url, '_blank');
      }
    },
    created(){ 
      let VideData = sessionStorage.getItem('VideData');
      if (VideData) {
        VideData = JSON.parse(VideData);
        this.ClassData = VideData[0];
        this.CourseData = VideData[1];
      }
      if (this.$route.params.data) {
        let classData = this.$route.params.data;
        this.newClass = classData;
        this.hasVideo = true;
        this.updata = true;
        // console.log(this.newClass)
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
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
    color: rgb(244, 67, 54);
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
  .videoBtn{
    margin-right: 20px;
    margin-bottom: 10px;
  }
</style>