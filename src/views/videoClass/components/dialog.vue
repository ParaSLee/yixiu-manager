<template>
<div>
  <mu-dialog :open="dialog" @close="close" scrollable>   

  <div slot="title" class="slotTitle">
    <span>课程详情</span>
    <div class="funcBtn">
      <mu-flat-button @click="deldia" secondary label="删除" class="delBtn"/>
      <mu-flat-button @click="changedia" primary label="修改" class="delBtn"/>
    </div>
  </div>
  
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="tab1" title="课程信息"/>
      <mu-tab value="tab3" title="课程介绍"/>
      <mu-tab value="tab4" title="课程章节"/>
    </mu-tabs>

    <div v-if="activeTab === 'tab1'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">课程ID：</span> 
        {{ questionData._id }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">课程名：</span> 
        {{ questionData.name }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">课程等级：</span> 
        {{ levelText[questionData.level] }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">课程封面：</span> 
        <img :src="questionData.info?questionData.info.cover:''" class="cover" @click="lookImg(questionData.info.cover)">
      </p>
      <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>
      <div class="dialogBland2"></div>
      <div class="dialogBland bottomline"></div>
      <div class="dialogBland2"></div>
      <p class="dialogBox">
        <span class="messageTitle">课程价格：</span> 
        {{ questionData.price !== 0 ? `${questionData.price/100} 元` : '免费' }}
      </p>
    </div>


    <div v-if="activeTab === 'tab3'">
      <div class="dialogBland"></div>
      <div class="contentBox canchose">
        <div v-html="questionData.desc" class="Qcontent"></div>
        <div class="dialogBland"></div>
      </div>
      
    </div>

    <div v-if="activeTab === 'tab4'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose" v-for="(item,index) in courseData">
        <span class="messageTitle">{{ item?item.index : "" }}：</span> 
        {{ item?item.name : ""}}
      </p>
    </div>

    <mu-dialog :open="deldialog" title="删除" @close="closedel">
      确定删除？
      <mu-flat-button slot="actions" @click="closedel" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="delClass" label="确定"/>
    </mu-dialog>

    <mu-dialog :open="deldialog2" title="" @close="closeAll">
      删除成功！
      <mu-flat-button slot="actions" primary @click="closeAll" label="确定"/>
    </mu-dialog>

    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
  </mu-dialog>
</div>
</template>

<script>
import { delVideoData,getVideoData } from '../../common/api'
import seebigphoto from "../../common/seeBigPhoto";

  export default {
    props:{
      questionData:Object,
      dialog:Boolean
    },
    data(){
      return {
        id:"",
        courseData:[],
        circleShow:false,
        chosevalue:-1,
        levelText:{
          0:"初级",
          1:"中级",
          2:"高级",
        },
        activeTab: 'tab1',
        question:{
          collection:"Train",
          _id:"",
        },
        deldialog:false,
        deldialog2:false,
        bigImgUrl:"",
      }
    },
    components: {
      seebigphoto
    },
    methods: {
      changedia(){
        this.$router.push({ 
          name: 'addVideoClass',
          params: { 
            data: this.questionData, 
          }
        })
      },
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
      delClass(){
        this.circleShow = true;
        this.question._id = this.questionData._id;

        delVideoData(this.question).then(res => {
          this.circleShow = false;
          this.deldialog2 = true;
          // console.log(res)
        },(err => {
          console.log(err)
        }))
      },
      handleTabChange (val) {
        this.activeTab = val
      },
      deldia(){
        this.deldialog = true;
      },
      closedel(){
        this.deldialog = false;
      },
      closeAll(){
        this.deldialog2 = false;
        this.closedel();
        this.$emit("close")
        this.$emit("delclose")
      },
      getCourse(){
        let findquestion={
          collection:"TrainChapter",
          train:{
            _id:this.id
          }
        }
        getVideoData(findquestion).then(res => {
          this.courseData = res.sort(this.compare('index'));
        },(err => {
          console.log(err)
        }))
      }
    },
    updated(){
      if (this.id!==this.questionData._id) {
        this.id = this.questionData._id
        if (this.id !== undefined) {
          this.getCourse();
        }
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
  .slotTitle{
    width: 100%;
  }
  .funcBtn{
    float: right;
  }
</style>