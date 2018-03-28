<template>
<div>
  <mu-dialog :open="dialog" title="问题详情" @close="close" scrollable>   
  
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="tab1" title="问题信息"/>
      <mu-tab value="tab2" title="用户信息"/>
      <mu-tab value="tab3" title="问题详情"/>
      <mu-tab value="tab4" title="状态修改"/>
    </mu-tabs>

    <div v-if="activeTab === 'tab1'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">问题ID：</span> 
        {{ questionData._id }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">问题标题：</span> 
        {{ questionData.title }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">创建时间：</span> 
        {{ questionData.time }}
      </p>
      <div class="dialogBland2 bottomline"></div>
      <div class="dialogBland2"></div>
      <div class="dialogBox">
        <span class="messageTitle">问题简介：</span> 
        <div v-html="questionData.desc" class="Textdesc"></div>
      </div>
    </div>


    <div v-if="activeTab === 'tab2'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户ID：</span> 
        {{ questionData.author?questionData.author._id:"" }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">用户昵称：</span> 
        {{ questionData.author?questionData.author.name:"" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户电话：</span> 
        {{ questionData.author?questionData.author.mobile :""}}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户邮箱：</span> 
        {{ questionData.author?questionData.author.email :""}}
      </p>
      <div class="dialogBland"></div>
      <div class="dialogBland"></div>
    </div>


    <div v-if="activeTab === 'tab3'">
      <div class="dialogBland"></div>
      <div class="contentBox">
        <div v-html="questionData.info" class="Qcontent"></div>
        <div class="dialogBland"></div>
      </div>
      
    </div>

    <div v-if="activeTab === 'tab4'">
      <div class="dialogBland"></div>
      <span v-if="!changestateShow">
        <span class="messageTitle">问题状态：</span> 
        <span :class="stateStyle[questionData.state]">{{stateText[questionData.state]}}</span>
        <mu-flat-button label="修改状态" class="demo-flat-button changestateBtn" @click="chosestate" />
      </span>
      <span v-else class="changestateBox">
        <mu-radio label="待审核" name="group" nativeValue="0" v-model="chosevalue" class="demo-radio"/>
        <mu-radio label="正常" name="group" nativeValue="1" v-model="chosevalue" class="demo-radio"/>
        <mu-radio label="已采纳" name="group" nativeValue="2" v-model="chosevalue" class="demo-radio"/>
        <mu-radio label="已关闭" name="group" nativeValue="3" v-model="chosevalue" class="demo-radio"/>
        
        <mu-raised-button label="取消" class="demo-raised-button" @click="closechosestate" />
        <mu-raised-button label="更新" class="demo-raised-button" @click="changestate" primary/>
        <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
      </span>
    </div>
    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
  </mu-dialog>
</div>
</template>

<script>
import { updateQuestion } from '../../common/api'
import { Toast } from 'vant';

  export default {
    props:{
      questionData:Object,
      dialog:Boolean
    },
    data(){
      return {
        circleShow:false,
        chosevalue:-1,
        changestateShow:false,
        stateText:{
          0:"待审核",
          1:"正常",
          2:"已采纳",
          3:"已关闭"
        },
        stateStyle:{
          0:"wait",
          1:"normal",
          2:"chosed",
          3:"closed"
        },
        activeTab: 'tab1',
        question:{
          state: 0,
          _id:"",
        }
      }
    },
    components: {
    },
    methods: {
      //关闭dialog
      close(){
        // this.questionData = [];
        this.$emit("close")
      },
      //改变状态
      chosestate(){
        this.chosevalue = parseInt(this.questionData.state);
        this.changestateShow = true;
      },
      //关闭更改状态
      closechosestate(){
        this.changestateShow = false;
        this.chosevalue = -1;
      },
      //更新
      changestate(){
        this.circleShow = true;
        this.question.state = parseInt(this.chosevalue);
        this.question._id = this.questionData._id;

        updateQuestion(this.question).then(res => {
          this.circleShow = false;
          this.questionData.state = res.state;
          this.closechosestate();
        },(err => {
          console.log(err)
        }))
      },
      handleTabChange (val) {
        this.activeTab = val
      }
    },
    created(){
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