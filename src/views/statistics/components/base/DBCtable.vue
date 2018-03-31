<template>
<div>
  <mu-table enableSelectAll :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>店铺名</mu-th>
        <mu-th>建立时间</mu-th>
        <mu-th>客人联系方式</mu-th>
        <mu-th>交易金额</mu-th>
        <mu-th>状态</mu-th>
      </mu-tr>
    </mu-thead>
    <mu-tbody>
      <mu-tr v-for="quetion in AllShopData" :key="quetion._id" >
        <mu-td class="texthidden">
          <mu-icon-button tooltip="查看详情" tooltipPosition="bottom-right" touch @click.capture="open(quetion)" class="enterDetail"/>
            <sicon name="check" scale="2.3" class="checkI"></sicon>
          </mu-icon-button>
          &nbsp;{{ quetion.father ? quetion.father.name : "" }}
        </mu-td>
        <mu-td class="texthidden">{{ quetion.time }}</mu-td>
        <mu-td class="texthidden">{{ quetion.phone }}</mu-td>
        <mu-td class="texthidden">{{ quetion.payment/100 }} 元</mu-td>
        <mu-td class="texthidden" :class="stateStyle[quetion.stateW]">{{ quetion.stateW }}</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>

  <Mdialog @close="close" :questionData="signalShop" :dialog="dialog"></Mdialog>

</div>
</template>

<script>
  import Mdialog from "./DBCdialog"

  export default {
    props:{
      AllShopData:[Object,Array],
      loading:[Boolean],
      nextpage:[Boolean],
    },
    data(){
      return {
        list: ["全部"],  //选择的列表
        dialog: false,    //弹窗
        signalShop:{},
        stateStyle:{
          "已付款":"aleardy",
          "待付款":"wait",
          "已完成":"over",
          "维修中":"doing",
          "已取消":"quit"
        },
      }
    },
    components: {
      Mdialog,
    },
    methods: {
      //弹出
      open (AllShopData) {
        this.dialog = true;
        this.signalShop = AllShopData;
        console.log(this.signalShop);
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalShop = {};
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
  .listTable{
    margin-top: 10px;
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
  .texthidden{
    white-space:nowrap; 
    overflow: hidden;
    text-overflow:ellipsis;
  }
  .enterDetail{
    margin-left: -20px;
  }
  .aleardy{
    color: #17B978;
  }
  .wait{
    color: #EC7700;
  }
  .over{
    color: #1989AC;
  }
  .doing{
    color: #76A665;
  }
  .quit{
    color: #BBBBBB;
  }
</style>