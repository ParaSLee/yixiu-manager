<template>
<div>
  <mu-dialog :open="dialog" @close="close" scrollable>
    <div slot="title" class="titleBox">
      章节详情
      <mu-flat-button label="修改信息" class="demo-flat-button changebtn blueBtn" @click="confirmchange"/>
      <mu-circular-progress :size="40" v-if="circleShow" class="circleBox changebtn"/>
    </div>
    <p class="dialogBox canchose topItem">
      <span class="messageTitle">视频ID：</span> 
      {{ phoneModelData._id }}
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">视频名：</span> 
      <span>{{ phoneModelData.name }}</span>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">描述：</span> 
      <span>{{ phoneModelData.desc }}</span>
    </p>

    <div class="dialogBland bottomline"></div>

    <p class="dialogBox canchose">
      <span class="messageTitle">所属课程：</span> 
      <span>{{ phoneModelData.class }}</span>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">所属章节：</span> 
      <span>{{ phoneModelData.Chapter }}</span>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">章节索引：</span> 
      <span>{{ phoneModelData.index }}</span>
    </p>

    <div class="dialogBland bottomline"></div>

    <p class="dialogBox">
      <mu-raised-button label="查看视频" class="demo-raised-button videoBtn" primary @click="seeVideo"/>
    </p>

    <mu-flat-button label="删除该视频" class="demo-flat-button delbtn" @click="confirmdel" secondary/>
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
        circleShow:false,  //加载动画
        delDialog: false, //是否删除弹窗
      }
    },
    components: {
    },
    methods: {
      //关闭dialog
      close(){
        this.$emit("close")
      },
      // 点击修改型号
      confirmchange(){
        
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
          collection:"TrainVideo",
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
      },
      seeVideo(){
        window.open(this.phoneModelData.url, '_blank');
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
  .videoBtn{
    margin-top: 20px;
    margin-left: 30px;
  }
  .dialogBland{
    margin: 20px 0;
  }
  .bottomline{
    width: 80%;
    border-bottom: 1px solid rgba(153, 153, 153,0.7);
  }
</style>