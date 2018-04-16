<template>
<div>
  <div class="serchBox">
    <mu-raised-button label="添加品牌"  class="addBtn" @click="opennew"/>
  </div>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mu-table :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>ID</mu-th>
        <mu-th>手机品牌</mu-th>
        <mu-th>英文名称</mu-th>
        <mu-th>描述</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="phonebrand in PhonebrandData" :key="phonebrand._id" >
        <mu-td>
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(phonebrand)" />
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
          &nbsp;&nbsp;
          {{ phonebrand.id }}
        </mu-td>
        <mu-td>{{ phonebrand.name }}</mu-td>
        <mu-td>{{ phonebrand.alias }}</mu-td>
        <mu-td>{{ phonebrand.desc ? phonebrand.desc : '无' }}</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mdialog @close="close" :phonebrandData="signalbrand" :dialog="dialog"></mdialog>

  <newdialog @close="closenew" :dialog="newdialog"></newdialog>

</div>
</template>

<script>
  import { getPhoneBrand } from '../common/api'
  import Mdialog from "./components/dialog"
  import newdialog from "./components/adddialog"

  export default {
    data(){
      return {
        nextpage:true,
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        newdialog: false,  //新建品牌弹窗
        PhonebrandData:[
          // {
            // name:"", //店铺名
            // createdAt:"",  建立时间
            // time:"", 用于显示的时间
            // qualificationState: "",   是否通过审核  false未审核  0未通过  1通过
            // _id:"",   传入的ID
            // id:"",   用于显示的ID
            // contactNumber:"",   联系方式
          // }
        ],
        //单个shop信息
        signalbrand:{},
      }
    },
    components: {
      Mdialog,
      newdialog
    },
    methods: {
      //获取手机品牌内容
      getphonebrand (){
        this.circleShow = true;
        getPhoneBrand().then(res => {
          // console.log(res)
          this.listPhonebrandData(res.reverse())
        },(err => {
          console.log(err)
        }))
      },
      //显示手机品牌内容
      listPhonebrandData (Arr){
        for(let i in Arr){
          Arr[i].time = this.datestr(Arr[i].createdAt,"yyyy.MM.d");
          Arr[i].id = this.idstr(Arr[i]._id);
        }
        this.PhonebrandData = Arr;
        this.circleShow = false;
      },
      //弹出
      open (PhonebrandData) {
        this.dialog = true;
        this.signalbrand = PhonebrandData;
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
      }
    },
    created(){ 
      this.getphonebrand()
    }
  }
</script>

<style scoped>
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
  .addBtn{
    margin-left: 10px;
    margin-bottom: 20px;
  }

</style>