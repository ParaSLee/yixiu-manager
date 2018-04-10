<template>
<div>
  <mu-dialog :open="dialog" title="添加手机品牌" @close="close" scrollable>
    <p class="dialogBox canchose">
      <span class="messageTitle">名称：</span> 
      <mu-text-field v-model="newBrandData.name"/>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">类型：</span> 
      <mu-select-field v-model="newBrandData.type">
          <!-- <mu-menu-item value="plate" title="平台板块"/> -->
          <mu-menu-item value="service" title="维修服务"/>
          <!-- <mu-menu-item value="goods" title="普通商品"/> -->
        </mu-select-field>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">描述：</span> 
      <mu-text-field v-model="newBrandData.desc" hintText="(选填)"/>
    </p>
    
    <p class="dialogBox">
      <span class="messageTitle">(选填)封面：</span> 
      <img :src="newBrandData.cover" class="cover" @click="lookImg(newBrandData.cover)">
      <van-uploader :after-read="onRead" accept="image/jpeg,image/png,image/jpg">
        <van-icon name="photograph" />
      </van-uploader>
      <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">父级：</span> 
      <mu-select-field v-model="newBrandData.parent">
          <mu-menu-item value="5a82af59eed0097104c20ea6" title="手机维修"/>
        </mu-select-field>
    </p>

    <mu-flat-button slot="actions" @click="close" label="关闭"/>
    <mu-flat-button slot="actions" primary @click="add" label="提交"/>

    <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>
  </mu-dialog>
  
</div>
</template>

<script>
import { addServiceCategory } from '../../common/api';
import seebigphoto from "../../common/seeBigPhoto";
import axios from 'axios';
import { Uploader,Icon } from 'vant';

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
          type: "",
          desc:"",
          cover:"",
          parent:""
        },
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
        this.newBrandData={
          name:"",
          type: "",
          desc:"",
          cover:"",
          parent:""
        },
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
      //提交
      add(){
        if (this.newBrandData.name==="") {
          alert("名称不能为空！");
        }else if(this.newBrandData.type===""){
          alert("类型必须选择！");
        }else if(this.newBrandData.parent===""){
          alert("父类必须选择！");
        }else{
          addServiceCategory(this.newBrandData).then(res => {
            // alert("提交成功！");
            location.reload();
            console.log(res)
          },(err => {
            console.log(err)
          }))
        }
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
        axios.post('https://m.yixiutech.com/upload', fd, config)
        .then(res => {
          this.newBrandData.cover = res.data.data;
          this.circleShow = false;
        })
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