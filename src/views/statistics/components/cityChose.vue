<template>
<div>
  <mu-dialog :open="dialog" title="选择城市">
    <van-area :area-list="areaList" @confirm="emitData"/>
    <!-- <mu-flat-button label="确定" slot="actions" primary @click="emitData"/> -->
  </mu-dialog>
</div>
</template>

<script>
import { Area } from 'vant';
import areaList from './data/area.json'
export default {
  
  components:{
    [Area.name]:Area,
  },
  props:{
    dialog:[Boolean,String]
  },
  data () {
    return {
      areaList,
    }
  },
  methods: {
    emitData (value) {
      console.log(value)
      let choseCity = {
        province:value[0].name,
        county:value[1].name,
        area:value[2].name,
      }
      this.$emit("changeCity",choseCity);
    }
  }
}
</script>

<style lang="css">
.demo-picker-container{
  width: 256px;

}
</style>