<template>
<div>

  <mu-tabs :value="activeTab" @change="handleTabChange" class="mytabs">
    <mu-tab value="tab1" icon="home" title="店铺数据"/>
    <mu-tab value="tab2" icon="chrome_reader_mode" title="订单数据"/>
    <mu-tab value="tab3" icon="account_box" title="商户个人"/>
  </mu-tabs>
  <div class="mybland"></div>
  <sbc v-if="activeTab=='tab1'"></sbc>
  <dbc v-if="activeTab=='tab2'"></dbc>
  <dbm v-if="activeTab=='tab3'"></dbm>
  
</div>
</template>

<script>
  import sbc from "./components/shopBaseCity"
  import dbc from "./components/dataBaseCity"
  import dbm from "./components/dataBaseMan"
  export default {
    data(){
      return {
        activeTab: 'tab1'
      }
    },
    components: {
      sbc,
      dbc,
      dbm
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val
      }
    },
    created(){ 
      
    }
  }
</script>

<style scoped>
  @import 'https://fonts.googleapis.com/icon?family=Material+Icons';

  .mytabs{
    position: absolute;
    left: 0;
    top: 0;
  }
  .mybland{
    margin-top: 60px;
  }
</style>