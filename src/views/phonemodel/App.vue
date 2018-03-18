<template>
<div>
  <div class="serchBox">
    <mu-select-field label="请选择手机品牌" :maxHeight="300" @change="choseBrand">
      <mu-menu-item v-for="item, index in phonebrandname" :key="index" :title="item" :value="index"/>
    </mu-select-field>
    
    <mu-flat-button :disabled="!addnewbtnshow" label="添加新的型号" class="demo-flat-button addnewbtn" @click="addnewModel"/>
    <span v-if="!addnewbtnshow">选择手机品牌后才可添加该品牌的新型号手机</span>

    <!--   谢说的样式类型
    <p>请选择手机品牌：</p>
    <mu-raised-button label="苹果" class="demo-raised-button"/>
    <mu-raised-button label="小米" class="demo-raised-button"/>
    <mu-raised-button label="更多" class="demo-raised-button" @click="chosemoreBrand"/>
     -->
  </div>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mu-table :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>ID</mu-th>
        <mu-th>型号名称</mu-th>
        <mu-th>颜色</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="phonebrand in PhoneModelData" :key="phonebrand._id" >
        <mu-td>
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(phonebrand)" />
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
          &nbsp;&nbsp;
          {{ phonebrand.id }}
        </mu-td>
        <mu-td>{{ phonebrand.name }}</mu-td>
        <mu-td class="colorbox"><span v-for="item in phonebrand.color">{{ item }}</span></mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  
  <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/>

  <mdialog @close="close" :phoneModelData="signalbrand" :dialog="dialog"></mdialog>

  <newdialog @close="closenew" :dialog="newdialog" :brandid="brandid" :brandname="brandname"></newdialog>

  <!-- <more @close="closemore" :dialog="more" :phonebrandname="phonebrandname"></more> -->

</div>
</template>

<script>
  import { getPhoneBrand,getPhoneModelById } from '../common/api'
  import Mdialog from "./components/dialog"
  import newdialog from "./components/adddialog"
  // import more from "./components/more"

  export default {
    data(){
      return {
        addnewbtnshow: false,  //是否可添加新型号
        brandid:"",   //选中的手机
        brandname:"",   //选中的手机
        phonebrandname:[],  //存储手机品牌
        phonebrandid:[],  //存储手机品牌ID
        nextpage:true,
        circleShow:false,  //数据读取中
        dialog: false,    //弹窗
        newdialog: false,  //新建品牌弹窗
        // more:false,   //更多内容
        PhoneModelData:[],
        //单个shop信息
        signalbrand:{},
      }
    },
    components: {
      Mdialog,
      newdialog,
      // more
    },
    methods: {
      //添加新的型号
      addnewModel(){
        this.newdialog = true;
      },
      //获取手机品牌拥有的型号
      choseBrand(value){
        this.addnewbtnshow = true;
        this.circleShow = true;
        this.brandid = this.phonebrandid[value];
        this.brandname = this.phonebrandname[value];
        // console.log(this.brandid)
        getPhoneModelById(this.phonebrandid[value]).then(res => {
          this.listPhoneModelData(res);
        },(err => {
          console.log(err)
        }))
      },
      //获取手机品牌内容
      getphonebrand (){
        this.circleShow = true;
        getPhoneBrand().then(res => {
          for(let index in res){
            this.phonebrandname = this.phonebrandname.concat(res[index].name);
            this.phonebrandid = this.phonebrandid.concat(res[index]._id);
          }
          this.circleShow = false;
        },(err => {
          console.log(err)
        }))
      },
      //显示手机品牌内容
      listPhoneModelData (Arr){
        for(let i in Arr){
          Arr[i].time = this.datestr(Arr[i].createdAt,"yyyy.MM.d");
          Arr[i].id = this.idstr(Arr[i]._id);
        }
        this.PhoneModelData = Arr;
        console.log(this.PhoneModelData)
        this.circleShow = false;
      },
      //弹出
      open (PhoneModelData) {
        this.dialog = true;
        this.signalbrand = PhoneModelData;
        console.log(this.signalbrand);
      },
      opennew(){
        this.newdialog = true;
      },
      // chosemoreBrand(){
      //   this.more=true;
      // },
      //关闭
      close () {
        this.dialog = false;
        this.signalbrand = {};
      },
      closenew(){
        this.newdialog = false;
      },
      // closemore(){
      //   this.more=false;
      // },
    },
    created(){ 
      this.getphonebrand()
    }
  }
</script>

<style scoped> 
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
</style>