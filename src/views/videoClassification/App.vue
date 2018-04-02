<template>
<div>
  <div class="serchBox">
    <mu-raised-button label="添加分类"  class="addBtn" @click="opennew"/>
  </div>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mu-table :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>分类名称</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="phonebrand in PhonebrandData" :key="phonebrand._id" >
        <mu-td>{{ type[phonebrand.type] }}</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <newdialog @close="closenew" :dialog="newdialog"></newdialog>

</div>
</template>

<script>
  import { getServiceCategory,getALL } from '../common/api'
  import newdialog from "./components/adddialog"

  export default {
    data(){
      return {
        circleShow:false,  //数据读取中
        newdialog: false,  //新建品牌弹窗
        PhonebrandData:[],
        //单个shop信息
        type:{
          plate:"平台板块",
          service:"维修服务",
          goods:"普通商品"
        },
      }
    },
    components: {
      newdialog
    },
    methods: {
      //获取手机品牌内容
      getServiceCategory (){
        this.circleShow = true;
        getServiceCategory().then(res => {
          console.log(res)
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
      opennew(){
        this.newdialog = true;
      },
      closenew(){
        this.newdialog = false;
      }
    },
    created(){ 
      // this.getServiceCategory()
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