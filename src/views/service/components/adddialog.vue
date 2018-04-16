<template>
<div>
  <mu-dialog :open="dialog" title="添加手机品牌" @close="close" scrollable>
    <p class="dialogBox canchose topItem">
      <span class="messageTitle">所属品牌：</span> 
      {{ brandname }}
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">服务名称：</span> 
      <mu-text-field v-model="newBrandData.name" hintText="例如：外屏碎"/>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">价格：</span> 
      <mu-text-field v-model="newBrandData.price" hintText="整数，例如：199 "/> 元
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">描述：</span> 
      <mu-text-field v-model="newBrandData.desc" hintText="(选填)"/>
    </p>

    <p class="dialogBox">
      <span class="messageTitle">封面(选填)：</span> 
      <img :src="newBrandData.cover" class="cover" @click="lookImg(newBrandData.cover)">
      <van-uploader :after-read="onRead" accept="image/jpeg,image/png,image/jpg">
        <van-icon name="photograph" />
      </van-uploader>
      <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
    </p>

    <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>
    
    <mu-flat-button slot="actions" @click="close" label="关闭"/>
    <mu-flat-button slot="actions" primary @click="add" label="提交"/>
  </mu-dialog>
</div>
</template>

<script>
import { addService } from '../../common/api';
import seebigphoto from "../../common/seeBigPhoto";
import axios from 'axios';
import { Uploader,Icon } from 'vant';

  export default {
    props:{
      dialog:Boolean,
      brandid:String,
      brandname:String,
    },
    data(){
      return {
        circleShow:false,  //加载动画
        //保存修改的手机数据
        newBrandData:{
          name:"",
          price: "",
          desc:"",
          cover:"",
          support:[],
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
          price: "",
          desc:"",
          cover:"",
          support:[],
        },
        this.$emit("close")
      },
      //提交
      add(){
        let price = parseInt(this.newBrandData.price)
        if (this.newBrandData.name==="") {
          alert("名称不能为空！");
        }else if(this.newBrandData.price===""){
          alert("价格不能为空！");
        }else if(isNaN(price)){
          alert("价格请输入纯数字");
        }else{
          this.newBrandData.price = price;
          this.newBrandData.category = this.brandid;
          // this.newBrandData.shop = "all"

          // console.log(this.newBrandData)


          addService(this.newBrandData).then(res => {
            alert("提交成功！");
            // console.log(res)
            this.$emit("updateold")
            // location.reload();
          },(err => {
            console.log(err)
          }))
        }
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