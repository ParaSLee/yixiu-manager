<template>
<div>
  <div class="serchBox">
    <mu-raised-button :label="user.name" class="demo-raised-button userChoseBtn" @click="showuser"/>
    <userDialog :dialog="userdialogshow" @getuser="getuser" @closeuser="closeuser"></userDialog>
    
    <mu-flat-button :disabled="!addnewbtnshow" label="添加新章节" class="demo-flat-button addnewbtn" @click="addnewModel"/>
    <span v-if="!addnewbtnshow" style="color:rgb(126, 87, 194)">选择课程后才可添加该课程的章节</span>
  </div>

  <mu-raised-button :disabled="!addnewbtnshow" label="进入视频管理" class="demo-raised-button enterbtn" primary @click="enterVideos"/>
  <span v-if="!addnewbtnshow" style="color:rgb(126, 87, 194)">选择课程后才可修改该课程的视频</span>

  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mu-table :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>章节名称</mu-th>
        <mu-th>章节描述</mu-th>
        <mu-th>章节索引</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="phonebrand in PhoneModelData" :key="phonebrand._id" >
        <mu-td>
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(phonebrand)" class="enterDetail"/>
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
          {{ phonebrand.name }}
        </mu-td>
        <mu-td>{{ phonebrand.desc }}</mu-td>
        <mu-td>{{ phonebrand.index }}</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mdialog @close="close" :phoneModelData="signalbrand" :dialog="dialog" @deleted="choseBrand"></mdialog>

  <newdialog @close="closenew" :dialog="newdialog" :brandid="user.id" :brandname="user.name" @updata="choseBrand"></newdialog>

</div>
</template>

<script>
  import { getVideoData } from '../common/api'
  import Mdialog from "./components/dialog"
  import newdialog from "./components/adddialog"
  import userDialog from "./components/userChose"

  export default {
    data(){
      return {
        userdialogshow:false,  //显示选择程序
        user:{
          name:"选择课程",
          id:"",
        }, 
        findDataList:{
          collection:"TrainChapter",
          train:{
            _id:""
          }
        },
        addnewbtnshow: false,  //是否可添加新型号
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        newdialog: false,  //新建品牌弹窗
        PhoneModelData:[],
        //单个shop信息
        signalbrand:{},
      }
    },
    components: {
      Mdialog,
      newdialog,
      userDialog
    },
    methods: {
      enterVideos(){
        let VideData = [this.user,this.PhoneModelData]
        VideData = JSON.stringify(VideData)
        sessionStorage.setItem('VideData', VideData);
        // console.log(VideData)
        this.$router.push({ name: 'videosManage'})
      },
      showuser(){
        this.userdialogshow = true;
      },
      closeuser(){
        this.userdialogshow = false;
      },
      getuser(user){
        this.userdialogshow = false;
        this.user = user;
        this.choseBrand();
      },
      //添加新的型号
      addnewModel(){
        this.newdialog = true;
      },
      //获取手机品牌拥有的型号
      choseBrand(){
        this.addnewbtnshow = true;
        this.circleShow = true;
        this.findDataList.train._id = this.user.id;

        getVideoData(this.findDataList).then(res => {
          this.listPhoneModelData(res);
        },(err => {
          console.log(err)
        }))
      },
      //显示手机品牌内容
      listPhoneModelData (Arr){
        for(let i in Arr){
          Arr[i].id = this.idstr(Arr[i]._id);
        }
        this.PhoneModelData = Arr.sort(this.compare('index'));
        this.circleShow = false;
      },
      //弹出
      open (PhoneModelData) {
        this.dialog = true;
        this.signalbrand = PhoneModelData;
        // console.log(this.signalbrand);
      },
      opennew(){
        this.newdialog = true;
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalbrand = {};
      },
      closenew(){
        this.newdialog = false;
      },
    },
    created(){ 
      let VideData = sessionStorage.getItem('VideData');
      if (VideData) {
        VideData = JSON.parse(VideData);
        // console.log(VideData[0])
        this.getuser(VideData[0])
        sessionStorage.removeItem('VideData');
      }
    },
    destoryed(){
      sessionStorage.removeItem('VideData');
    }
  }
</script>

<style scoped> 
  .serchBox{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .serchBox p{
    margin-bottom: 10px;
  }
  .serchBox button{
    margin-right: 10px;
  }
  .listTable{
    margin-top: 30px;
  }
  .addnewbtn{
    margin-left: 20px;
    color:rgb(126, 87, 194);
  }
  .colorbox{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .colorbox span{
    margin-right: 3px;
  }
  .mu-table tbody{
    line-height: 48px;
  }
  .circleBox{
    position: absolute;
  }
  .checkI{
    margin-bottom: -5px;
    margin-left: -38px;
  }
  .addBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .userChoseBtn{
    margin-left: 10px;
    /*margin-bottom: 20px;*/
  }
  .enterDetail{
    margin-left: -20px;
  }
  .enterbtn{
    margin-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
  }
</style>