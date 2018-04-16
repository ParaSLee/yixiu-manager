<template>
<div>
  <mu-dialog :open="dialog" @close="close" scrollable>
    <div slot="title" class="titleBox">
      该分类详情
      <mu-flat-button label="修改信息" class="demo-flat-button changebtn blueBtn" v-if="!changebtnShow" @click="confirmchange"/>
      <span class="changebtn" v-else>
        <mu-flat-button label="取消" class="demo-flat-button" @click="closeChange"/>
        <mu-flat-button label="确定" class="demo-flat-button blueBtn" @click="changestate"/>
      </span>
      <mu-circular-progress :size="40" v-if="circleShow" class="circleBox changebtn"/>
    </div>
    <p class="dialogBox canchose topItem">
      <span class="messageTitle">ID：</span> 
      {{ phonebrandData._id }}
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">名称：</span> 
      <span v-if="!changebtnShow">{{ phonebrandData.name }}</span>
      <mu-text-field v-else v-model="newBrandData.name"/>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">所属父类：</span> 
      <span v-if="!changebtnShow">{{ phonebrandData.parent ? phonebrandData.parent.name : "无" }}</span>
      <mu-select-field v-else v-model="newBrandData.parent" :value="newBrandData.parent">
        <mu-menu-item value="5a82af59eed0097104c20ea6" title="手机维修"/>
      </mu-select-field>
    </p>
    <p class="dialogBox canchose">
      <span class="messageTitle">描述：</span> 
      <span v-if="!changebtnShow">{{ phonebrandData.desc ? phonebrandData.desc : '无' }}</span>
      <mu-text-field v-else v-model="newBrandData.desc"/>
    </p>
    
    <p class="dialogBox">
      <span class="messageTitle">封面：</span> 
      <span v-if="!changebtnShow"> 
        <img :src="phonebrandData.cover" class="cover" @click="lookImg(phonebrandData.cover)">
      </span>
      
      <span v-else class="photobox"> 
        <img :src="newBrandData.cover" class="cover" @click="lookImg(phonebrandData.cover)">
        <van-uploader :after-read="onRead" accept="image/jpeg,image/png,image/jpg">
          <van-icon name="photograph" />
        </van-uploader>
        <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
      </span>
    </p>

    <p class="dialogBox canchose">
      <span class="messageTitle">所属分类：</span> 
      <span v-if="!changebtnShow">{{ type[phonebrandData.type] ? type[phonebrandData.type] : "无" }}</span>
      <mu-select-field v-else v-model="newBrandData.type" :value="type[newBrandData.type]">
        <!-- <mu-menu-item value="plate" title="平台板块"/> -->
        <mu-menu-item value="service" title="维修服务"/>
        <!-- <mu-menu-item value="goods" title="普通商品"/> -->
      </mu-select-field>
    </p>

    <p class="dialogBox">
      <span class="messageTitle">品牌添加时间：</span> 
      {{ phonebrandData.time }}
    </p>
    <mu-flat-button label="删除该分类" class="demo-flat-button delbtn" @click="confirmdel" secondary/>
    <mu-flat-button slot="actions" @click="close" label="关闭"/>
    <seebigphoto v-if="bigImgUrl!==''" :imgurl="bigImgUrl" @closeimg="closeimg"></seebigphoto>
  </mu-dialog>


  <mu-dialog :open="delDialog" title="确定删除？" @close="closedel">
    <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
    <mu-flat-button slot="actions" @click="closedel" primary label="取消"/>
    <mu-flat-button slot="actions" primary @click="delthisbrand" label="确定"/>
  </mu-dialog>
  

</div>
</template>

<script>
import { delServiceCategory,updataServiceCategory } from '../../common/api'
import seebigphoto from "../../common/seeBigPhoto"
import axios from 'axios'
import { Uploader,Icon } from 'vant';

  export default {
    props:{
      phonebrandData:Object,
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
          type: "",
          desc:"",
          cover:"",
          _id:"",
          parent:""
        },
        type:{
          plate:"平台板块",
          service:"维修服务",
          goods:"普通商品"
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
        this.closeChange();
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
      //更新状态
      changestate(){
        this.circleShow = true;
        delete this.newBrandData.id;
        delete this.newBrandData.time;
        delete this.newBrandData.createdAt;
        delete this.newBrandData.updatedAt;
        delete this.newBrandData.__v;

        // console.log(this.newBrandData)
        updataServiceCategory(this.newBrandData).then(res => {
          if (res==="更新成功") {
            this.phonebrandData.name = this.newBrandData.name;
            this.phonebrandData.type = this.newBrandData.type;
            this.phonebrandData.desc = this.newBrandData.desc;
            this.phonebrandData.cover = this.newBrandData.cover;
            this.phonebrandData.parent._id = this.newBrandData.parent;

            this.changebtnShow = false;
            alert("更新成功")
          }else{
            alert("更新失败")
          }
          this.circleShow = false;
        },(err => {
          console.log(err)
        }))
      },
      // 点击修改品牌
      confirmchange(){
        this.changebtnShow = true;
        this.newBrandData = this.copy(this.phonebrandData);
        delete this.newBrandData.parent;
        this.newBrandData.parent = this.phonebrandData.parent._id
        // console.log(this.newBrandData)
        // this.newBrandData.cover = this.phonebrandData.cover,
        // this.newBrandData.desc = "",
      },
      // 关闭修改品牌
      closeChange(){
        this.changebtnShow = false;
        this.newBrandData = {
          name:"",
          type: "",
          desc:"",
          coer:"",
          _id:"",
          parent:""
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
      //删除这个品牌
      delthisbrand(){
        this.circleShow = true;
        let delData = {
          _id: this.phonebrandData._id
        }
        delServiceCategory(delData).then(res => {
          this.circleShow = false;
          alert("删除成功")
          location.reload();
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