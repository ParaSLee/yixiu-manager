<template>
  <div class="manage-container">
    <div class="manage-left">
      <div 
        v-for="(item, index) in items" 
        @click="changeTage(index)"
        :class="index == nowitem ? 'chosedTag' : ''"
        :key="index"
      > 
        {{ item.name }} 
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
          {
            name:"添加商户",
            url:"/home/adduser"
          },
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
        console.log(this.nowitem);
        this.nowitem = index;
        this.$router.push(this.items[index].url)
      },
      changeTag(url){
        
      }
    },
    created(){
      if (this.$route.path === "/home/adduser") {
        this.nowitem = 0
      }else if(this.$route.path === "/home/examine") {
        this.nowitem = 1
      }else if(this.$route.path === "/home/listmanage") {
        this.nowitem = 2
      }else if(this.$route.path === "/home/questionexamine") {
        this.nowitem = 3
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
    padding-left: 35px;
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

</style>