<template>
<div>
  <div class="stateChoseBox">
    <mu-radio name="group" nativeValue="全部" v-model="list" label="全部" class="demo-radio stateChoseItem"/> <br/>
    <mu-radio name="group" nativeValue="待付款" v-model="list" label="待付款" class="demo-radio stateChoseItem"/> <br/>
    <mu-radio name="group" nativeValue="已付款" v-model="list" label="已付款" class="demo-radio stateChoseItem"/> <br/>
    <mu-radio name="group" nativeValue="维修中" v-model="list" label="维修中" class="demo-radio stateChoseItem"/> <br/>
    <mu-radio name="group" nativeValue="已完成" v-model="list" label="已完成" class="demo-radio stateChoseItem"/> <br/>
    <mu-radio name="group" nativeValue="已取消" v-model="list" label="已取消" class="demo-radio stateChoseItem"/> <br/>
    <mu-flat-button label="订单状态查询" class="demo-flat-button stateBtn" primary @click="changeState"/>
  </div>
  <mu-table enableSelectAll :showCheckbox="false" ref="table" class="listTable" :height="'660px'">
    <mu-thead>
      <mu-tr>
        <mu-th>客人昵称</mu-th>
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
          &nbsp;{{ quetion.name }}
        </mu-td>
        <mu-td class="texthidden">{{ quetion.time }}</mu-td>
        <mu-td class="texthidden">{{ quetion.phone }}</mu-td>
        <mu-td class="texthidden">{{ quetion.allmoney }} 元</mu-td>
        <mu-td class="texthidden" :class="stateStyle[quetion.stateW]">{{ quetion.stateW }}</mu-td>
      </mu-tr>
    </mu-tbody>
  </mu-table>

  <div class="ManagePagination">
    <mu-raised-button v-if="nextpage" label="点击加载更多" class="demo-raised-button" @click="moreSearch" :disabled="loading" primary/>
    <mu-raised-button v-else label="已无法获取更多内容" class="demo-raised-button" disabled/>
  </div>

  <Mdialog @close="close" :questionData="signalShop" :dialog="dialog"></Mdialog>

</div>
</template>

<script>
  import Mdialog from "./DBMdialog"

  export default {
    props:{
      AllShopData:[Object,Array],
      loading:[Boolean],
      nextpage:[Boolean],
    },
    data(){
      return {
        list: "全部",  //选择的列表
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
        // console.log(this.signalShop);
      },
      //关闭
      close () {
        this.dialog = false;
        this.signalShop = {};
      },
      moreSearch(){
        this.$emit("moreSearch")
      },
      changeState(){
        this.$emit("changeState",this.list)
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
  .stateChoseBox{
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    margin-left: 6px;
  }
  .stateBtn{
    margin-top: -5px;
  }
  .stateChoseItem{
    margin-right: 20px;
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
  .ManagePagination{
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }

</style>