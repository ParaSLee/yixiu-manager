<template>
<div>
  <div class="serchBox">
    <span class="courseTitle">课程： {{ ClassData.name }}</span> 

    <div>
      <mu-raised-button label="返回" @click="prepage"/>
      <mu-flat-button label="添加视频" class="demo-flat-button addBtn" primary @click="addVideos"/>
    </div>


    <div class="serchContant">
      <mu-select-field v-model="serchstate" label="选择课程章节" class="serchstateBox">
        <mu-menu-item value="全部" title="全部"/>

        <mu-menu-item v-for="item in CourseData" :key="item.index" :value="item._id" :title="`${item.index}. ${item.name}`"/>
      </mu-select-field>

      <mu-raised-button label="搜索" @click="toSearch" class="returnBtn" primary/>

    </div>
  </div>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mu-table enableSelectAll :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>视频标题</mu-th>
        <mu-th>视频简述</mu-th>
        <mu-th>视频id</mu-th>
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
        <mu-td class="texthidden">{{ quetion.id }}</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <Mdialog @close="close" :phoneModelData="signalquetion" :dialog="dialog"></Mdialog>

</div>
</template>

<script>
  import { getVideoData } from '../common/api'
  import Mdialog from "./components/dialog"

  export default {
    data(){
      return {
        ClassData:{},
        CourseData:[],
        serchstate:"全部",  // 搜索的状态
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        findquestion:{
          collection:"TrainVideo",
          train:{
            _id:""
          }
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
      prepage () {
        this.dialog = false;
        this.$router.push({ path: '/home/videoCourse'})
      },
      //获取10条问题内容
      getQlist (pickData){
        this.circleShow = true;
        getVideoData(pickData).then(res => {
          this.listquestionData(res)
        },(err => {
          console.log(err)
        }))
      },
      //显示问题内容
      listquestionData (Arr){
        // console.log(Arr)
        for(let i in Arr){
          Arr[i].id = this.idstr(Arr[i]._id);
          Arr[i].class = this.ClassData.name;
          for(let j of this.CourseData){
            if (j._id == Arr[i].trainChapter) {
              Arr[i].Chapter = j.name;
              Arr[i].Chapterindex = j.index;

              break;
            }
          }
        }
        this.questionData = Arr;
        this.circleShow = false;
      },
      //搜索
      toSearch(){
        if (this.serchstate === "全部") {
          delete this.findquestion.trainChapter;
        }else{
          this.findquestion.trainChapter = {};
          this.findquestion.trainChapter._id = this.serchstate;
        }
        this.getQlist(this.findquestion)
      },
      //弹出
      open (questionData) {
        this.dialog = true;
        this.signalquetion = questionData;
        // console.log(this.signalquetion);
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalquetion = {};
      },
      addVideos(){
        this.$router.push({ name: 'addVideos'})
      }
    },
    created(){ 
      let VideData = sessionStorage.getItem('VideData');
      if (VideData) {
        VideData = JSON.parse(VideData);
        this.ClassData = VideData[0];
        this.CourseData = VideData[1];
        this.findquestion.train._id = this.ClassData.id
        this.getQlist(this.findquestion);
      }
      // console.log(this.ClassData)
      // console.log(this.CourseData)
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
    width: 200px;
    margin-right: 20px;
  }
  .listTable{
    margin-top: 30px;
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
  .returnBtn{
    margin-left: 10px;
    margin-bottom: 20px;
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
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
    color:rgb(126, 87, 194);
  }
  .courseTitle{
    font-size: 25px;
    margin-bottom: 20px;
  }
</style>