<template>
<div>
  <div class="serchBox">
    <mu-raised-button label="添加课程"  class="addBtn" @click="addVideoClass"/>

    <div class="serchContant">
      <mu-select-field v-model="serchstate" label="选择课程级别" class="serchstateBox">
        <mu-menu-item value="全部" title="全部"/>
        <mu-menu-item value="初级" title="初级"/>
        <mu-menu-item value="中级" title="中级"/>
        <mu-menu-item value="高级" title="高级"/>
      </mu-select-field>

      <mu-text-field hintText="搜索课程" v-model="searchText" style="width:200px;"/>

      <mu-raised-button label="搜索" @click="toSearch" class="returnBtn" primary/>
      
      <mu-raised-button label="返回全部" @click="returnAll" v-if="returnAllShow" class="returnBtn" primary/>
    </div>
  </div>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mu-table enableSelectAll :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>课程标题</mu-th>
        <mu-th>课程简述</mu-th>
        <mu-th>课程价位</mu-th>
        <mu-th>课程等级</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="quetion in questionData" :key="quetion._id" >
        <mu-td>
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(quetion)" class="enterDetail"/>
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
          {{ quetion.name }}
        </mu-td>
        <mu-td class="texthidden">{{ quetion.desc }}</mu-td>
        <mu-td class="texthidden">{{ quetion.price !== 0 ? `${quetion.price/100} 元` : '免费' }}</mu-td>
        <mu-td class="texthidden">{{ levelText[quetion.level] }}</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <Mdialog @close="close" :questionData="signalquetion" :dialog="dialog"></Mdialog>

</div>
</template>

<script>
  import { getVideoData } from '../common/api'
  import Mdialog from "./components/dialog"

  export default {
    data(){
      return {
        levelText:{
          0:"初级",
          1:"中级",
          2:"高级"
        },
        serchstate:"全部",  // 搜索的状态
        searchText:"",  // 搜索的文字
        returnAllShow:false,
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        findquestion:{
          collection:"Train",
        },
        questionData:[],
        //单个quetion信息
        signalquetion:{},
      }
    },
    components: {
      Mdialog
    },
    methods: {
      //获取10条问题内容
      getQlist (pickData,type){
        this.circleShow = true;
        getVideoData(pickData).then(res => {
          this.listquestionData(res, type)
        },(err => {
          console.log(err)
        }))
      },
      //显示问题内容
      listquestionData (Arr,type){
        console.log(Arr)
        for(let i in Arr){
          Arr[i].id = this.idstr(Arr[i]._id);
        }
        this.questionData = Arr;
        this.circleShow = false;
      },
      //返回全部搜索
      returnAll(){
        delete this.findquestion.name;
        delete this.findquestion.level;

        this.getQlist(this.findquestion);
        this.returnAllShow = false;
        this.searchText = "";
        this.serchstate = "全部";
      },
      //搜索
      toSearch(){
        if (this.serchstate === "全部") {
          delete this.findquestion.level;
        }else{
          for(let index in this.levelText){
            if(this.levelText[index]==this.serchstate){
              this.findquestion.level = index.toString();
              break;
            }
          }
        }
        if (this.searchText !== "") {
          this.findquestion.name=this.searchText;
        }else{
          delete this.findquestion.name;
        }
        this.getQlist(this.findquestion)
        this.returnAllShow = true;
        if (this.serchstate === "全部" && this.searchText === "") {
          this.returnAllShow = false;
        }
      },
      //弹出
      open (questionData) {
        this.dialog = true;
        this.signalquetion = questionData;
        console.log(this.signalquetion);
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalquetion = {};
      },
      addVideoClass(){
        this.$router.push({ name: 'addVideoClass'})
      }
    },
    created(){ 
      this.getQlist(this.findquestion)
    }
  }
</script>

<style scoped>
  .serchBox{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .serchContant{
    margin-top: 20px;
    display: flex;
    align-items: flex-end;
  }
  .serchstateBox{
    width: 100px;
    margin-right: 20px;
  }
  .listTable{
    margin-top: 30px;
  }
  .mu-table tbody{
    line-height: 48px;
  }
  .deletequetionBtn{ 
    margin-top: 30px;
  }
  .ManagePagination{
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .btnBox{
    margin-right: 20px;
  }
  .circleBox{
    position: absolute;
  }
  .checkI{
    margin-bottom: -5px;
    margin-left: -38px;
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
  .myinput{
    position: absolute;
    display: inline-block;
    width: 256px;
    height: 32px;
    font-size: 16px;
    background: transparent;
    color: transparent;
    outline-color: rgb(224, 224, 224);
    margin-top: -51px;
  }
  .returnBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .deletequetionBtn{ 
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
  .texthidden{
    white-space:nowrap; 
    overflow: hidden;
    text-overflow:ellipsis;
  }
  .enterDetail{
    margin-left: -20px;
  }
  .addBtn{
    /*position: absolute;*/
    /*left: 30px;*/
    /*top: 0px;*/
  }

  

</style>