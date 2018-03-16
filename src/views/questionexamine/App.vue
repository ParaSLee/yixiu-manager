<template>
<div>
  <div class="serchBox">
    <mu-select-field v-model="serchstate" label="选择问题状态" class="serchstateBox">
      <mu-menu-item value="全部" title="全部"/>
      <mu-menu-item value="待审核" title="待审核"/>
      <mu-menu-item value="正常" title="正常"/>
      <mu-menu-item value="已采纳" title="已采纳"/>
      <mu-menu-item value="已关闭" title="已关闭"/>
    </mu-select-field>

    <mu-text-field hintText="搜索标题" v-model="searchText" style="width:200px;"/>

    <mu-raised-button label="搜索" @click="toSearch" class="returnBtn" primary/>
    
    <mu-raised-button label="返回全部" @click="returnAll" v-if="returnAllShow" class="returnBtn" primary/>
  </div>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mu-table enableSelectAll :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>问题ID</mu-th>
        <mu-th>问题标题</mu-th>
        <mu-th>问题简述</mu-th>
        <mu-th>提问人</mu-th>
        <mu-th>时间</mu-th>
        <mu-th>问题状态</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="quetion in questionData" :key="quetion._id" >
        <mu-td>{{ quetion.id }}</mu-td>
        <mu-td class="texthidden">{{ quetion.title }}</mu-td>
        <mu-td class="texthidden">{{ quetion.intro }}</mu-td>
        <mu-td class="texthidden" v-if="quetion.author!=null">{{ quetion.author.name }}</mu-td>
        <mu-td class="texthidden" v-else>无</mu-td>
        <mu-td class="texthidden">{{ quetion.time }}</mu-td>
        <mu-td>
          <span :class="stateStyle[quetion.state]">{{ stateText[quetion.state] }}</span>
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(quetion)"/>
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
        </mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>


  <Mdialog @close="close" :questionData="signalquetion" :dialog="dialog"></Mdialog>

  <div class="ManagePagination">
    <mu-raised-button v-if="nextpage" label="获取更多内容" primary class="demo-raised-button" @click="moreSearch" :disabled="loading"/>
    <mu-raised-button v-else label="已无法获取更多内容" class="demo-raised-button" disabled/>
  </div>
</div>
</template>

<script>
  import { getQuestionList } from '../common/api'
  import Mdialog from "./components/dialog"

  export default {
    data(){
      return {
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
        loading:true,
        nextpage:true,
        serchstate:"全部",  // 搜索的状态
        searchText:"",  // 搜索的文字
        returnAllShow:false,
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        findquestion:{
          limit:10, //一次获取列表的条数,系统默认为10
          skip:0 //跳过几个数据,系统默认为0
        },
        author:[],
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
        getQuestionList(pickData).then(res => {
          this.listquestionData(res, type)
        },(err => {
          console.log(err)
        }))
      },
      //删除Html标签
      delHTML(info){
        let reg = /<.*>/g;
        let reg2 = /&nbsp;/g;
        let newinfor = info.replace(reg,"");
        newinfor = newinfor.replace(reg2," ");
        return newinfor;
      },
      //显示问题内容
      listquestionData (Arr,type){
        // console.log(Arr)
        for(let i in Arr){
          
          // if (Arr[i].author==null) {
          //   this.author = this.author.concat("{name:'无'}")
          // }else{
          //   this.author = this.author.concat(Arr[i].author);
          // }
          Arr[i].time = this.datestr(Arr[i].createdAt,"yyyy.MM.d");
          Arr[i].id = this.idstr(Arr[i]._id);
          Arr[i].intro = this.delHTML(Arr[i].info)
        }
        console.log(this.author)
        if (type==="增加") {
          if (Arr.length < 10) {
            this.nextpage = false;
          }
          this.questionData = this.questionData.concat(Arr);
          this.returnAllShow = true;
          this.loading=false;
        }else{
          this.questionData = Arr;
          if (Arr.length < 10) {
            this.nextpage = false;
          }
          this.loading=false;
        }
        // this.delquetionList = [];
        this.circleShow = false;
      },
      //返回全部搜索
      returnAll(){
        delete this.findquestion.title;
        delete this.findquestion.state;
        this.findquestion.limit=10;
        this.findquestion.skip=0;
        this.getQlist(this.findquestion);
        this.returnAllShow = false;
        this.searchText = "";
        this.serchstate = "全部";
      },
      //获取更多搜索内容
      moreSearch(){
        // if (this.serchstate === "全部") {
        //   delete this.findquestion.state;
        // }else{
        //   for(let index in stateText){
        //     if(stateText[index]==this.serchstate){
        //       this.findquestion.state = index;
        //       break;
        //     }
        //   }
        // }
        // if (this.searchText !== "") {
        //   this.findquestion.title=this.searchText;
        // }
        this.loading = true;
        this.findquestion.limit+=10;
        this.findquestion.skip+=10;
        let type = "增加";
        this.getQlist(this.findquestion,type)
      },
      //搜索
      toSearch(){
        if (this.serchstate === "全部") {
          delete this.findquestion.state;
        }else{
          for(let index in this.stateText){
            if(this.stateText[index]==this.serchstate){
              this.findquestion.state = parseInt(index);
              break;
            }
          }
        }
        if (this.searchText !== "") {
          this.findquestion.title=this.searchText;
        }

        this.findquestion.limit=10;
        this.findquestion.skip=0;
        // let type = "增加";
        this.getQlist(this.findquestion)
        this.loading = true;
        this.returnAllShow = true;
        this.nextpage = true;
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

  

</style>