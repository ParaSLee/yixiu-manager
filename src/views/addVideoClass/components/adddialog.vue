<template>
<div>
  <mu-dialog :open="dialog" title="添加课程分类" @close="close" scrollable>
    <p class="dialogBox canchose">
      <span class="messageTitle">名称：</span> 
      <mu-text-field v-model="newBrandData.name"/>
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
import { addServiceCategory } from '../../common/api';

  export default {
    props:{
      dialog:Boolean
    },
    data(){
      return {
        circleShow:false,  //加载动画
        //保存修改的手机数据
        newBrandData:{
          name:"",
          desc:"",
        },
      }
    },
    components: {

    },
    methods: {
      //关闭dialog
      close(){
        this.newBrandData={
          name:"",
          desc:"",
        },
        this.$emit("close")
      },
      //提交
      add(){
        if (this.newBrandData.name==="") {
          alert("名称不能为空！");
        }else{
          // addServiceCategory(this.newBrandData).then(res => {
          //   // alert("提交成功！");
          //   location.reload();
          //   console.log(res)
          // },(err => {
          //   console.log(err)
          // }))
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