<template>
<div>
  <mu-dialog :open="dialog" @close="close" scrollable>  
    <div class="searchBox" slot="title">
      <mu-text-field hintText="输入商户名" v-model="searchName" class="inputname" /><br/>
      <mu-flat-button label="搜索" class="demo-flat-button" @click="search"/>
      <span class="notice">只能获取到正常运营的商户</span>
      <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
    </div> 
    <div style="overflow:hidden">
      <div class="userInfoBox" v-for="(user,index) in shopData" @click="choseTage(index)"
        :class="index == nowitem ? 'chosedTag' : ''">
        <div>店铺名：{{ user?user.name:"" }}</div>
        <div>ID：{{ user?user.id:"" }}</div>
        <div>封面： <img :src="user.cover?user.cover:''"></div>
      </div>
    </div>
    


    <div class="ManagePagination">
      <mu-raised-button v-if="nextpage" label="获取更多内容" primary class="demo-raised-button" @click="moreSearch" :disabled="loading"/>
      <mu-raised-button v-else label="已无法获取更多内容" class="demo-raised-button" disabled/>
    </div>

    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
    <mu-flat-button slot="actions" @click="get" primary label="确定"/>
  </mu-dialog>
</div>
</template>

<script>
  import { getShopListSort } from '../../../common/api.js'
  export default {
    props:{
      dialog:Boolean
    },
    data(){
      return {
        nowitem: -1,
        loading:true,
        searchName:"",
        findshopLish:{
          // name: "",
          limit:10,//一次获取列表的条数,系统默认为10
          skip:0,//跳过几个数据,系统默认为0
          qualificationState:"正常"
        },
        circleShow:false,
        shopData:[],
        nextpage:true,
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
      getShopList (pickData,type){
        getShopListSort(pickData).then(res => {
          this.circleShow = false;
          this.listShopData(res,type)
        },(err => {
          console.log(err)
        }))
      },
      listShopData (Arr,type){
        for(let i in Arr){
          Arr[i].id = this.idstr(Arr[i]._id);
        }
        if (type==="增加") {
          if (Arr.length < 10) {
            this.nextpage = false;
          }
          this.shopData = this.shopData.concat(Arr);
          this.returnAllShow = true;
          this.loading=false;
        }else{
          this.shopData = Arr;
          if (Arr.length < 10) {
            this.nextpage = false;
          }
          this.loading=false;
        }
        console.log(this.shopData)
        this.circleShow = false;
      },
      //关闭dialog
      close(){
        this.$emit("closeuser")
      },
      get(){
        let user = this.copy(this.user);
        this.$emit("getuser",user)
      },
      search(){
        if (this.searchName !== "") {
          this.findshopLish.name=this.searchName;
        }
        this.findshopLish.limit=10;
        this.findshopLish.skip=0;
        this.getShopList(this.findshopLish);
        this.circleShow = true;
      },
      moreSearch(){
        this.loading = true;
        this.findshopLish.limit+=10;
        this.findshopLish.skip+=10;
        let type = "增加";
        this.getShopList(this.findshopLish,type)
      },
    }
  }
</script>

<style scoped>
  .searchBox{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
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
    color: #23B1A5;
    margin-left: 10px;
  }
  
</style>