<template>
<div>
  <mu-dialog :open="dialog" title="问题详情" @close="close" scrollable>   
  
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="tab1" title="返利信息"/>
    </mu-tabs>

    <div v-if="activeTab === 'tab1'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户ID：</span> 
        {{ questionData._id }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">邀请人数：</span> 
        {{ userNumber }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">总返利：</span> 
        {{ allnumber }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">已返利：</span>
        {{ surplusnumber }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">待返利：</span>
        {{ allnumber - surplusnumber }}
      </p>
      <div class="search">
        <button @click="serchmoney (questionData)">查询</button>
      </div>
    </div>


    <div v-if="activeTab === 'tab2'">
      <div class="dialogBland"></div>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户ID：</span> 
        {{ questionData.author?questionData.author._id:"" }}
      </p>
      <p class="dialogBox">
        <span class="messageTitle">用户昵称：</span> 
        {{ questionData.author?questionData.author.name:"" }}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户电话：</span> 
        {{ questionData.author?questionData.author.mobile :""}}
      </p>
      <p class="dialogBox canchose">
        <span class="messageTitle">用户邮箱：</span> 
        {{ questionData.author?questionData.author.email :""}}
      </p>
      <div class="dialogBland"></div>
      <div class="dialogBland"></div>
    </div>


    <div v-if="activeTab === 'tab3'">
      <div class="dialogBland"></div>
      <div class="contentBox">
        <div v-html="questionData.info" class="Qcontent"></div>
        <div class="dialogBland"></div>
      </div>
      
    </div>

    <div v-if="activeTab === 'tab4'">
      <div class="dialogBland"></div>
      <span v-if="!changestateShow">
        <span class="messageTitle">问题状态：</span> 
        <span :class="stateStyle[questionData.state]">{{stateText[questionData.state]}}</span>
        <mu-flat-button label="修改状态" class="demo-flat-button changestateBtn" @click="chosestate" />
      </span>
      <span v-else class="changestateBox">
        <mu-radio label="待审核" name="group" nativeValue="0" v-model="chosevalue" class="demo-radio"/>
        <mu-radio label="正常" name="group" nativeValue="1" v-model="chosevalue" class="demo-radio"/>
        <mu-radio label="已采纳" name="group" nativeValue="2" v-model="chosevalue" class="demo-radio"/>
        <mu-radio label="已关闭" name="group" nativeValue="3" v-model="chosevalue" class="demo-radio"/>
        
        <mu-raised-button label="取消" class="demo-raised-button" @click="closechosestate" />
        <mu-raised-button label="更新" class="demo-raised-button" @click="changestate" primary/>
        <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>
      </span>
    </div>
    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
  </mu-dialog>
</div>
</template>

<script>
import { updateQuestion } from '../../common/api'
import { Toast, Button } from 'vant';

  export default {
    props:{
      questionData:Object,
      dialog:Boolean
    },
    data(){
      return {
        userNumber: 0,
        allnumber: 0,
        surplusnumber: 0,
        userlist: [],
        allUserIds: [],
        circleShow:false,
        chosevalue:-1,
        changestateShow:false,
        stateText:{
          0:"待审核",
          1:"正常",
          2:"已采纳",
          3:"已关闭"
        },
        stateStyle:{
          0:"wait",
          1:"normal",
          2:"chosed",
          3:"closed"
        },
        activeTab: 'tab1',
        question:{
          state: 0,
          _id:"",
        }
      }
    },
    components: {
      [Button.name]: Button,
    },
    methods: {
      //关闭dialog
      close(){
        // this.questionData = [];
        this.$emit("close")
      },
      async serchmoney(questionData){
        let userId = questionData._id;
        console.log(userId);
        // let userId = "5ad21852ab85e142eaef9276";
        // let userId = '5ad6cf52060e415f31618742';
        // let userId = "5ad2b050ab85e142eaef929c";
        // 1.获取关联用户
        let userLists = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
            collection:'User',
            parent: userId,
            limit: 0,
            select:{_id:1},
		    })
        console.log('----------------------');
        console.log(userLists);
        // let userIdlist = userLists.data;
        this.userNumber = userLists.length;
        // if(userIdlist.length == 0){
        //   alert("已推荐0人，加油哦！");
        //   return;
        // } else {
        //   alert("已推荐" + userIdlist.length + "人");
        // }
        
        // console.log(userIdlist.length);
        // console.log(userIdlist);

        let userids = [];
        if(userLists.length>0){
          for(var x= 0; x<userLists.length; x++){
            userids.push(userLists[x]._id);
          }
        }
        this.allUserIds = userids;
        console.log('----------------------1');
        console.log(userids);
        //2.根据获取到的列表,查询订单列表
        // let iduser = "5ad209cfab85e142eaef9271"
        let userOrderlist = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
          collection:'Order',
          user:{
            $in:userids//遍历childrenShoplist的_id放到这里面
            // $in:[iduser]
          },
          limit: 0,
          state: 13,
          select:{payment:1},
        })
        console.log("--------------------------2");
        console.log(userOrderlist);
        // let userOrderlists = userOrderlist.data;
        let sumMoney = 0;
        if(userOrderlist.length>0){
          for(var y= 0; y<userOrderlist.length; y++){
            sumMoney = sumMoney + userOrderlist[y].payment;
           }
        }
        console.log("--------------------------3");
        console.log(sumMoney);
        this.allnumber = (sumMoney/100)*0.03;
        console.log(this.allnumber);
        // 已返利订单查询

        let userOrderlistHadGet = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
          collection:'Order',
          user:{
            $in:userids//遍历childrenShoplist的_id放到这里面
            // $in:[iduser]
          },
          limit: 0,
          state: 13,
          rebate: true,
          select:{payment:1},
        })

        console.log(userOrderlistHadGet);
        // let userOrderlistHadGets = userOrderlistHadGet.data;
        let sum = 0;
        if(userOrderlistHadGet.length>0){
          for(var y= 0; y<userOrderlistHadGet.length; y++){
            sum = sum + userOrderlistHadGet[y].payment;
           }
        }
        console.log("--------------------------3");
        console.log(sum);
        this.surplusnumber = (sum/100)*0.03;
        console.log(this.surplusnumber);
      },
      //改变状态
      chosestate(){
        this.chosevalue = parseInt(this.questionData.state);
        this.changestateShow = true;
      },
      //关闭更改状态
      closechosestate(){
        this.changestateShow = false;
        this.chosevalue = -1;
      },
      //更新
      changestate(){
        this.circleShow = true;
        this.question.state = parseInt(this.chosevalue);
        this.question._id = this.questionData._id;

        updateQuestion(this.question).then(res => {
          this.circleShow = false;
          this.questionData.state = res.state;
          this.closechosestate();
        },(err => {
          console.log(err)
        }))
      },
      handleTabChange (val) {
        this.activeTab = val
      }
    },
    async created(){
        // let userId = questionData._id;

        // // let userId = "5ad21852ab85e142eaef9276";
        // // let userId = '5ad6cf52060e415f31618742';
        // // let userId = "5ad2b050ab85e142eaef929c";
        // // 1.获取关联用户
        // let userLists = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
        //     collection:'User',
        //     parent: userId,
        //     limit: 0,
        //     select:{_id:1},
		    // })
        // console.log('----------------------');
        // console.log(userLists);
        // let userIdlist = userLists.data;
        // this.number = userIdlist.length;
        // // if(userIdlist.length == 0){
        // //   alert("已推荐0人，加油哦！");
        // //   return;
        // // } else {
        // //   alert("已推荐" + userIdlist.length + "人");
        // // }
        
        // console.log(userIdlist.length);
        // console.log(userIdlist);

        // let userids = [];
        // if(userIdlist.length>0){
        //   for(var x= 0; x<userIdlist.length; x++){
        //     userids.push(userIdlist[x]._id);
        //   }
        // }
        // this.allUserIds = userids;
        // console.log('----------------------1');
        // console.log(userids);
        // //2.根据获取到的列表,查询订单列表
        // // let iduser = "5ad209cfab85e142eaef9271"
        // let userOrderlist = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
        //   collection:'Order',
        //   user:{
        //     $in:userids//遍历childrenShoplist的_id放到这里面
        //     // $in:[iduser]
        //   },
        //   limit: 0,
        //   state: 13,
        //   select:{payment:1},
        // })
        // console.log("--------------------------2");
        // console.log(userOrderlist);
        // let userOrderlists = userOrderlist.data;
        // let sumMoney = 0;
        // if(userOrderlists.length>0){
        //   for(var y= 0; y<userOrderlists.length; y++){
        //     sumMoney = sumMoney + userOrderlists[y].payment;
        //    }
        // }
        // console.log("--------------------------3");
        // console.log(sumMoney);
        // this.allnumber = (sumMoney/100)*0.03;
        // console.log(this.allnumber);
        // // 已返利订单查询

        // let userOrderlistHadGet = await this.$api.sendData('https://m.yixiutech.com/sql/find/', {
        //   collection:'Order',
        //   user:{
        //     $in:userids//遍历childrenShoplist的_id放到这里面
        //     // $in:[iduser]
        //   },
        //   limit: 0,
        //   state: 13,
        //   rebate: true,
        //   select:{payment:1},
        // })

        // console.log(userOrderlistHadGet);
        // let userOrderlistHadGets = userOrderlistHadGet.data;
        // let sum = 0;
        // if(userOrderlistHadGets.length>0){
        //   for(var y= 0; y<userOrderlistHadGets.length; y++){
        //     sum = sum + userOrderlistHadGets[y].payment;
        //    }
        // }
        // console.log("--------------------------3");
        // console.log(sum);
        // this.surplusnumber = (sum/100)*0.03;
        // console.log(this.surplusnumber);
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
    margin-bottom: 5px;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
  }
  .Textdesc >>> img{
    max-width: 200px;
    max-height: 200px;
  }
  .contentBox{
    border: 4px dotted #E4EDDB;
    padding: 10px;
    font-size: 18px;
    color: #000;
  }
  .Qcontent >>> img{
    display: block;
    margin: 20px auto;
    max-width: 100%;
    max-height: 300px;
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
  .divflex{
    width: 80%;
    display: flex;
    flex-direction:column;
    justify-content: flex-start;
    align-items: center;
  }
  .divflex span{
    width: 100%;
    display: flex;
    flex-direction:row;
    justify-content: flex-start;
  }
  .dialogBland{
    margin-top: 50px;
  }
  .dialogBland2{
    margin-top: 20px;
  }
  .bottomline{
    width: 80%;
    border-bottom: 1px solid rgba(153, 153, 153,0.7);
  }
  .normal{
    color: #17B978;
  }
  .wait{
    color: #EC7700;
  }
  .chosed{
    color: #00B7C2;
  }
  .closed{
    /*color: */
  }
</style>