<template>
<div>
  <mu-dialog :open="dialog" title="添加手机品牌" @close="close" scrollable>
    <p class="dialogBox canchose topItem">
      <span class="messageTitle">所属课程：</span> 
      {{ brandname }}
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">章节名称：</span> 
      <mu-text-field v-model="newBrandData.name" hintText="(必填)"/>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">章节索引：</span> 
      <mu-text-field v-model="index" hintText="纯数字，例如：1 (表示第一章)"/>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">描述：</span> 
      <mu-text-field v-model="newBrandData.desc" hintText="(选填)"/>
    </p>
    
    <mu-flat-button slot="actions" @click="close" label="关闭"/>
    <mu-flat-button slot="actions" primary @click="add" label="提交"/>
  </mu-dialog>
</div>
</template>

<script>
import { addVideoData } from '../../common/api';
import { Uploader,Icon } from 'vant';

  export default {
    props:{
      dialog:Boolean,
      brandid:String,
      brandname:String,
    },
    data(){
      return {
        colors:"",
        circleShow:false,  //加载动画
        index:null,
        //保存修改的手机数据
        newBrandData:{
          collection:"TrainChapter",
          name:"",
          index:0,   //索引
          desc:"",
          info:{},
          train:{
            _id:this.brandid
          }
        },
      }
    },
    components: {
      [Uploader.name]:Uploader,
      [Icon.name]:Icon,
    },
    methods: {
      //关闭dialog
      close(){
        this.$emit("close")
      },
      //提交
      add(){
        if (this.newBrandData.name==="") {
          alert("名称不能为空！");
        }else if(this.index===null){
          alert("索引不能为空！");
        }else if(typeof Number(this.index) !== "number" || isNaN(Number(this.index))){
          alert("索引只能是纯数字");
        }else{
          this.newBrandData.index = this.index;
          this.newBrandData.train._id = this.brandid;
          addVideoData(this.newBrandData).then(res => {
            alert("提交成功！");
            this.$emit("updata")
          },(err => {
            console.log(err)
          }))
        }
      },
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
    margin-top: 5px;
    padding-bottom: 5px;
    border-bottom: 0.5px solid rgba(153, 153, 153,0.1);
    display: flex;
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

</style>