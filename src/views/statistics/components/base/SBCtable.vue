<template>
<div>
  <mu-table enableSelectAll :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>店铺名</mu-th>
        <mu-th>建立时间</mu-th>
        <mu-th>联系方式</mu-th>
        <mu-th>交易金额</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="quetion in AllShopData" :key="quetion._id" >
        <mu-td class="texthidden">
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(quetion)" class="enterDetail"/>
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
          &nbsp;{{ quetion.name }}
        </mu-td>
        <mu-td class="texthidden">{{ quetion.time }}</mu-td>
        <mu-td class="texthidden">{{ quetion.contactNumber }}</mu-td>
        <mu-td class="texthidden">{{ quetion.allmoney }} 元</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>
  <!-- <mu-circular-progress :size="40" v-if="circleShow" class="circleBox"/> -->


  <Mdialog @close="close" :questionData="signalShop" :dialog="dialog"></Mdialog>

</div>
</template>

<script>
  
  import { getshopAllData } from '../../../common/api'
  import Mdialog from "./SBCdialog"
  import cityDialog from "./cityChose"
  import Datepicker from 'vuejs-datepicker';
  

  export default {
    props:{
      AllShopData:[Object,Array]
    },
    data(){
      return {
        dialog: false,    //弹窗
        findshopAllData:{
          detail:true, //是否显示店铺详情
          // pay:true, //是否缴纳保证金
          qualification:true //审核是否通过
        },
        signalShop:{},
      }
    },
    components: {
      Mdialog,
      cityDialog,
      Datepicker
    },
    methods: {
      open (AllShopData) {
        this.dialog = true;
        this.signalShop = AllShopData;
        console.log(this.signalShop);
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalShop = {};
      },
    },
    updata(){
      if (this.AllShopData) {
        this.listAllShopData(this.AllShopData)
      }
    }
  }
</script>

<style scoped>
  .choseTime{
    margin-left: 7px;
    margin-bottom: 20px;
    border-bottom: 3px solid #eee;
    padding-bottom: 3px;
    padding-left: 5px;
  }
  .stateChoseBox{
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    margin-left: 6px;
  }
  .listTable{
    margin-top: 10px;
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
  .noshop{
    color:#F27370;
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

</style>