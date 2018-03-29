<template>
<div>
  <mu-dialog :open="dialog" title="选择城市" @close="close">
    <v-distpicker @province="onprovince" @city="oncity" @area="onarea"></v-distpicker>

    <mu-flat-button label="取消" slot="actions" primary @click="close"/>
    <mu-flat-button label="确定" slot="actions" primary @click="emitData"/>
  </mu-dialog>
</div>
</template>

<script>
import VDistpicker from 'v-distpicker'

export default {
  components:{
    VDistpicker,
  },
  props:{
    dialog:[Boolean,String]
  },
  data () {
    return {
      // areaList,
      select:{
        province:"",
        city:"",
        area:""
      }
    }
  },
  methods: {
    close(){
      this.$emit("closeCity");
    },
    onprovince(data){
      this.select.province = data.value;
    },
    oncity(data){
      this.select.city = data.value;
    },
    onarea(data) {
      this.select.area = data.value;
    },
    emitData () {
      let choseCity = {
        province:this.select.province,
        county:this.select.city,
        area:this.select.area,
      }
      this.select.province = "";
      this.select.city = "";
      this.select.area = "";
      // console.log(choseCity)
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