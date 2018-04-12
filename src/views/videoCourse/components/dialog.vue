<template>
<div>
  <mu-dialog :open="dialog" @close="close" scrollable>
    <div slot="title" class="titleBox">
      章节详情
      <mu-flat-button label="修改信息" class="demo-flat-button changebtn blueBtn" v-if="!changebtnShow" @click="confirmchange"/>
      <span class="changebtn" v-else>
        <mu-flat-button label="取消" class="demo-flat-button" @click="closeChange"/>
        <mu-flat-button label="确定" class="demo-flat-button blueBtn" @click="changestate"/>
      </span>
      <mu-circular-progress :size="40" v-if="circleShow" class="circleBox changebtn"/>
    </div>
    <p class="dialogBox canchose topItem">
      <span class="messageTitle">章节ID：</span> 
      {{ phoneModelData._id }}
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">章节名：</span> 
      <span v-if="!changebtnShow">{{ phoneModelData.name }}</span>
      <mu-text-field v-else v-model="newBrandData.name"/>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">描述：</span> 
      <span v-if="!changebtnShow">{{ phoneModelData.desc ? phoneModelData.desc : '无' }}</span>
      <mu-text-field v-else v-model="newBrandData.desc" hintText="(选填)"/>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">章节索引：</span> 
      <span v-if="!changebtnShow">{{ phoneModelData.index }}</span>
      <mu-text-field v-else v-model="newBrandData.index"/>
    </p>

    <mu-flat-button label="删除该章节" class="demo-flat-button delbtn" @click="confirmdel" secondary/>
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
import { delVideoData,upVideoData } from '../../common/api'


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
          index:0,
          desc:""
        },
        phonebrand:"",  //手机品牌
      }
    },
    components: {

    },
    methods: {
      //关闭dialog
      close(){
        this.closeChange();
        this.$emit("close")
      },
      //更新状态
      changestate(){
        this.circleShow = true;
        let pushData = {
          collection:"TrainChapter",
          find:{
            _id:this.newBrandData._id
          },
          update:{
            desc:this.newBrandData.desc,
            index:this.newBrandData.index,
            name:this.newBrandData.name
          }
        }
        // console.log(pushData)

        upVideoData(pushData).then(res => {
          // console.log(res)
          if (res==="更新成功") {
            this.phoneModelData.name = this.newBrandData.name;
            this.phoneModelData.index = this.newBrandData.index;
            this.phoneModelData.desc = this.newBrandData.desc;
            this.changebtnShow = false;
            this.close();
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
      },
      // 关闭修改型号
      closeChange(){
        this.changebtnShow = false;
        this.newBrandData = {
          name:"",
          _id:"",
          index:0,
          desc:""
        }
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
          collection:"TrainChapter",
          _id: this.phoneModelData._id
        }
        delVideoData(delData).then(res => {
          this.circleShow = false;
          alert("删除成功");
          this.closedel();
          this.close();
          this.$emit("deleted")
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