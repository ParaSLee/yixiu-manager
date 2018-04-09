<template>
<div>
  <mu-dialog :open="dialog" @close="close" scrollable>  
    <div class="searchBox" slot="title">
      <mu-select-field v-model="findshopLish.level" label="选择课程级别" class="serchstateBox">
        <mu-menu-item value="0" title="初级"/>
        <mu-menu-item value="1" title="中级"/>
        <mu-menu-item value="2" title="高级"/>
      </mu-select-field>
      <mu-flat-button label="搜索" class="demo-flat-button" @click="search"/>
      <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
    </div> 
    <div style="overflow:hidden">
      <div class="userInfoBox" v-for="(user,index) in shopData" @click="choseTage(index)"
        :class="index == nowitem ? 'chosedTag' : ''">
        <div>课程名：{{ user?user.name:"" }}</div>
        <div>ID：{{ user?user.id:"" }}</div>
        <div>封面： <img :src="user.info?user.info.cover:''"></div>
      </div>
    </div>
    
    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
    <mu-flat-button slot="actions" @click="get" primary label="确定"/>
  </mu-dialog>
</div>
</template>

<script>
  import { getVideoData } from '../../common/api.js'
  export default {
    props:{
      dialog:Boolean
    },
    data(){
      return {
        nowitem: -1,
        findshopLish:{
          collection:"Train",
          level:""
        },
        circleShow:false,
        shopData:[],
        user:{
          name:"",
          id:""
        }
      }
    },
    components: {
    },
    methods: {
      choseTage(index) {
        this.nowitem = index;
        this.user.name=this.shopData[this.nowitem].name;
        this.user.id=this.shopData[this.nowitem]._id;
      },
      //获取10条商家内容
      getShopList (pickData){
        getVideoData(pickData).then(res => {
          this.listShopData(res)
        },(err => {
          console.log(err)
        }))
      },
      listShopData (Arr,type){
        for(let i in Arr){
          Arr[i].id = this.idstr(Arr[i]._id);
        }
        this.shopData = Arr;
        this.circleShow = false;
      },
      //关闭dialog
      close(){
        this.$emit("closeuser")
      },
      get(){
        if (this.user.id == "") {
          this.close()
        }else{
          let user = this.copy(this.user);
          this.$emit("getuser",user)
        }
      },
      search(){
        if (this.findshopLish.level!== "") {
          this.nowitem = (-1);
          this.getShopList(this.findshopLish);
          this.circleShow = true;
        } 
      }
    }
  }
</script>

<style scoped>
  .searchBox{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
  }
  .inputname{
    margin-right: 20px;
  }
  .userInfoBox{
    float: left;
    display: inline-block;
    width: 200px;
    min-height: 180px;
    border:1px solid rgb(55, 71, 79);
    border-radius: 5px;
    color: rgb(83, 97, 105);
    font-size: 16px;
    background: rgb(236, 239, 241);
    margin: 20px 10px;
    padding: 5px;
    padding-left: 10px;
    cursor: pointer;
  }
  .userInfoBox:hover{
    background: rgb(218, 223, 234);
    border-color: rgb(63, 81, 181);
    color: rgb(108, 122, 196);
  }
  .chosedTag{
    background: rgb(235, 247, 253);
    border-color: rgb(186, 227, 249);
    color: rgb(0, 164, 223);
  }
  .chosedTag:hover{
    background: rgb(235, 247, 253);
    border-color: rgb(186, 227, 249);
    color: rgb(0, 164, 223);
  }
  .userInfoBox div{
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }
  .userInfoBox img{
    max-width: 100px;
    max-height: 100px;
  }
  .ManagePagination{
    display: flex;
    justify-content: center;
    margin: 30px 0;
  }
  .notice{
    font-size: 12px;
    color: rgb(126, 87, 194);
    margin-left: 10px;
  }
  
</style>