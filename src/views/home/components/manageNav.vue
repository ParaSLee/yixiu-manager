<template>
  <div class="manage-container">
    <div class="manage-left">
      <div 
        v-for="(item, index) in items" v-if="!item.type"
        @click="changeTage(index)"
        :class="index == nowitem ? 'chosedTag' : ''"
        :key="index"
      > 
        {{ item.name }} 
      </div>
      <div v-else class="sedtitle">
        {{ item.name }} <sicon name="down" scale="1.7" color="rgb(50, 50, 50)"></sicon>
      </div>
    </div>
  </div>
</template>

<script>
  //vant
  export default {
    data(){
      return {
        nowitem: null,
        items:[
          // {
          //   name:"添加商户",
          //   url:"/home/adduser"
          // },
          {
            name:"商户审核",
            url:"/home/examine"
          },
          {
            name:"查删订单",
            url:"/home/listmanage"
          },
          {
            name:"问题审核",
            url:"/home/questionexamine"
          },
          {
            name:"数据统计",
            url:"/home/statistics"
          },
          {
            name:"手机管理",
            url:"",
            type:"father"
          },
          {
            name:"手机品牌管理",
            url:"/home/phonebrand"
          },
          {
            name:"手机型号管理",
            url:"/home/phonemodel"
          },
          {
            name:"维修管理",
            url:"",
            type:"father"
          },
          {
            name:"维修分类管理",
            url:"/home/serviceClassification"
          },
          {
            name:"维修内容管理",
            url:"/home/service"
          },
          {
            name:"视频管理",
            url:"",
            type:"father"
          },
          {
            name:"课程分类",
            url:"/home/videoClassification"
          },
          {
            name:"课程管理",
            url:"/home/videoClass"
          },
          {
            name:"课程章节管理",
            url:"/home/videoCourse"
          },
          {
            name:"退出",
            url:"/signin"
          },
        ]
      }
    },
    components: {
      
    },
    methods: {
      changeTage(index) {
        this.nowitem = index;
        this.$router.push(this.items[index].url)
      },
      changeTag(url){
        
      }
    },
    created(){
      /*if (this.$route.path === "/home/adduser") {
        this.nowitem = 0
      }else */if(this.$route.path === "/home/examine") {
        this.nowitem = 0
      }else if(this.$route.path === "/home/listmanage") {
        this.nowitem = 1
      }else if(this.$route.path === "/home/questionexamine") {
        this.nowitem = 2
      }else if(this.$route.path === "/home/statistics") {
        this.nowitem = 3
      }else if(this.$route.path === "/home/phonebrand") {
        this.nowitem = 4
      }else if(this.$route.path === "/home/phonemodel") {
        this.nowitem = 2
      }else if(this.$route.path === "/home/serviceClassification") {
        this.nowitem = 6
      }else if(this.$route.path === "/home/service") {
        this.nowitem = 7
      }else if(this.$route.path === "/home/videoClassification") {
        this.nowitem = 8
      }

      // this.changeTag(this.$route.path);
    }
  }
</script>

<style scoped>
  .manage-container{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(58, 58, 58);
    overflow: hidden;
    z-index: 99;
  }
  .manage-left{
    float: left;
    width: 288px;
    margin-top: 35px;
  }
  .manage-left div{
    height: 45px;
    padding-left: 55px;
    border-bottom: 1px solid rgb(72, 72, 72);
    line-height: 45px;
    color: rgb(169, 169, 169);
    cursor: pointer;
    transition: background .3s ease;
    font-family: "Microsoft YaHei";
    font-weight: 700;
  }
  .manage-left div:hover{
    background-color: rgb(73, 73, 73);
  }
  .manage-left .chosedTag{
    background: rgb(39, 39, 39);
    color: #fff;
  }
  .manage-left .chosedTag:hover{
    background: rgb(39, 39, 39);
    color: #fff;
  }
  .manager-right{
    margin-left: 288px;
    background: #fff;
    min-height: 100%;
    padding: 53px 68px;
    margin-top: 13px;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .manage-left .sedtitle{
    background: rgb(248, 249, 252);
    color: rgb(50, 50, 50);
    cursor: default;
    padding-left: 35px;
  }
  .manage-left .sedtitle:hover{
    background: rgb(248, 249, 252);
    color: rgb(50, 50, 50);
  }
  .manage-left .sedtitle svg{
    float: right;
    margin-top: 15px;
    margin-right: 20px;
  }
</style>