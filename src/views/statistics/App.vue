<template>
<div>

  <mu-tabs :value="activeTab" @change="handleTabChange" class="mytabs">
    <mu-tab value="tab1" icon="chrome_reader_mode" title="总体数据"/>
    <mu-tab value="tab2" icon="account_box" title="商户个人"/>
  </mu-tabs>
  <div class="mybland"></div>
  <dbc v-if="activeTab=='tab1'"></dbc>
  <dbm v-if="activeTab=='tab2'"></dbm>
  
</div>
</template>

<script>
  import dbc from "./components/dataBaseCity"
  import dbm from "./components/dataBaseMan"
  export default {
    data(){
      return {
        activeTab: 'tab1'
      }
    },
    components: {
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