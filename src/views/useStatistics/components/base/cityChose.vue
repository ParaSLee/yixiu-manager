<template>
<div>
  <mu-dialog :open="dialog" title="选择城市" @close="close" >
    <div class="citychose">
      <p class="tips">只会显示 有正常运营店铺 的城市</p>
      <div class="loading" v-if="loadcity">    
        <mu-circular-progress :size="60" :strokeWidth="5" style="margin-bottom:20px"/>
        城市数据获取中...
      </div>
      <!-- <v-distpicker @province="onprovince" @city="oncity" @area="onarea"></v-distpicker> -->
      <div id="test">
          <mu-select-field label="省：" :maxHeight="300" v-model="provinceSelected" class="cityWidth">
            <mu-menu-item v-for="item, index in provinceList" :key="index" :title="item.name" :value="item.id"/>
          </mu-select-field>
          <mu-select-field label="市：" :maxHeight="300" v-model="citySelected" class="cityWidth">
            <mu-menu-item v-for="item, index in cityList" :key="index" :title="item.name" :value="item.id"/>
          </mu-select-field>
          <mu-select-field label="区：" :maxHeight="300" v-model="areaSelected" class="cityWidth">
            <mu-menu-item v-for="item, index in areaList" :key="index" :title="item.name" :value="item.id"/>
          </mu-select-field>

          <!-- 省：
          <select v-model="provinceSelected">
            <option v-for="item in provinceList" :value="item.id">{{item.name}}</option>
          </select>
          市：
          <select v-model="citySelected">
              <option v-for="item in cityList" :value="item.id">{{item.name}}</option>
          </select>
          区：
          <select v-model="areaSelected">
              <option v-for="item in areaList" :value="item.id">{{item.name}}</option>
          </select> -->
      </div>
      <div class="actionBtn">
        <mu-flat-button label="取消" slot="actions" primary @click="close"/>
        <mu-flat-button label="确定" slot="actions" primary @click="emitData"/>
      </div>
    </div>
  </mu-dialog>
</div>
</template>

<script>
import { getshopareaData } from '../../../common/api'
import VDistpicker from 'v-distpicker'

var provinceRows = [
    // {name:"测试",id:"1"},
    // {name:"2",id:"2"},
];
var cityRows = [
    // {name:"11",id:"1",pid:"1"},
    // {name:"12",id:"2",pid:"1"},
    // {name:"21",id:"3",pid:"2"},
    // {name:"22",id:"4",pid:"2"}
];
var areaRows = [
    // {name:"重庆A",id:"1",pid:"1"},
    // {name:"11冲B2",id:"2",pid:"1"},
    // {name:"HANGA",id:"3",pid:"2"},
    // {name:"HANGAB",id:"4",pid:"2"},
]


export default {
  components:{
    VDistpicker,
  },
  props:{
    dialog:[Boolean,String]
  },
  data () {
    return {
      loadcity: true,
      select:{
        province:"",
        city:"",
        area:""
      },
      provinceSelected:"",
      provinceList:[],
      citySelected:"",
      cityList:[],
      areaSelected:"",
      areaList:[],
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
    getCityData(tarlist,tar){
      let mytar;
      tarlist.forEach(res=>{
        if (res.id==(tar)) {
          mytar = res.name;
          return 0;
        }
      })
      return mytar;
    },
    emitData () {
      let county = this.getCityData(this.cityList,this.citySelected);
      let area = this.getCityData(this.areaList,this.areaSelected);

      let choseCity = {
        province: 
          this.provinceList[this.provinceSelected-1] ?
          this.provinceList[this.provinceSelected-1].name :
          "",
        county: county ? county : "",
        area: area ? area : ""
      }
      // console.log(choseCity)
      this.$emit("changeCity",choseCity);
    },
    //地址重排序
    addressSort(){
      let a = function (x, y) {
        if (x.name < y.name) {
          return 1;
        } else if (x.name === y.name) {
          return x.a > y.a ? 1 : -1;
        } else if (x.name < y.name) {
          return -1;
        }
      }
      return a;
    },
    pullprovince(res){
      const province = new Set();
      res.forEach(res => {
        province.add(res.province)
      })

      let num = 1;
      for (let i of province) {
        let add = {
          name:i,
          id:num.toString()
        }
        provinceRows = provinceRows.concat(add)
        num +=1;
      }
    },
    pullcity(res){
      const P_city = new Set();
      const city = new Set();
      res.forEach(res => {
        if (city.has(res.city) === false) {
          P_city.add([res.province,res.city]);
          city.add(res.city)
        }
      })

      let num = 1;
      let oldfid = 0;
      for (let i of P_city) {
        let fid = 0;
        provinceRows.forEach(res=>{
          if (res.name===i[0]) {
            fid = res.id;
            return 0;
          }
        })
        if (fid != oldfid) {
          let addAll = {
            name:"",
            id:num.toString(),
            pid:fid
          }
          num +=1;
          cityRows = cityRows.concat(addAll);
          oldfid = fid;
        }
        let add = {
          name:i[1],
          id:num.toString(),
          pid:fid
        }
        cityRows = cityRows.concat(add)
        num +=1;
      }
    },
    pulldistrict(res){
      const P_pulldistrict = new Set();
      const pulldistrict = new Set();
      res.forEach(res => {
        if (pulldistrict.has(res.district) === false) {
          P_pulldistrict.add([res.city,res.district]);
          pulldistrict.add(res.district)
        }
      })
      // console.log(P_pulldistrict)
      // console.log(pulldistrict)

      let num = 1;
      let oldfid = 0;
      for (let i of P_pulldistrict) {
        let fid = 0;
        cityRows.forEach(res=>{
          if (res.name===i[0]) {
            fid = res.id;
            return 0;
          }
        })

        if (fid != oldfid) {
          let addAll = {
            name:"",
            id:num.toString(),
            pid:fid
          }
          num +=1;
          areaRows = areaRows.concat(addAll);
          oldfid = fid;
        }
        let add = {
          name:i[1],
          id:num.toString(),
          pid:fid
        }
        areaRows = areaRows.concat(add)
        num +=1;
      }
    }
  },
  created(){
    if (provinceRows.length == 0) {
      let a={
        pay:true,
        qualification:true
      }
      getshopareaData(a).then(res=>{
        res = res.sort(this.addressSort())
        this.pullprovince(res);
        return res;
      }).then(res=>{
        this.pullcity(res);
        return res;
      }).then(res=>{
        this.pulldistrict(res);
        return res;
      }).then(res=>{
        this.provinceList = provinceRows;
        this.provinceSelected = this.provinceList.length>0 ? this.provinceList[0].id : "";

        var val = this.provinceSelected;
        this.cityList = cityRows.filter(function (x) { return x.pid == val });
        this.citySelected = this.cityList.length>0 ? this.cityList[0].id : "";

        val = this.citySelected;
        this.areaList = areaRows.filter(function (x){ return x.pid == val});
        this.areaSelected = this.areaList.length>0 ? this.areaList[0].id : "";

        this.loadcity = false;
      })
    }else{
      this.provinceList = provinceRows;
      this.provinceSelected = this.provinceList.length>0 ? this.provinceList[0].id : "";

      var val = this.provinceSelected;
      this.cityList = cityRows.filter(function (x) { return x.pid == val });
      this.citySelected = this.cityList.length>0 ? this.cityList[0].id : "";

      val = this.citySelected;
      this.areaList = areaRows.filter(function (x){ return x.pid == val});
      this.areaSelected = this.areaList.length>0 ? this.areaList[0].id : "";

      this.loadcity = false;
    }
  },
  watch:{
    provinceSelected:function (val) {
      this.cityList = cityRows.filter(function (x) { return x.pid == val });
      this.citySelected = this.cityList.length>0 ? this.cityList[0].id : "";
    },
    citySelected:function (val) {
      this.areaList = areaRows.filter(function (x){ return x.pid == val});
      this.areaSelected = this.areaList.length>0 ? this.areaList[0].id : "";
    }
  }
}
</script>

<style lang="css">
.demo-picker-container{
  width: 256px;
}
.cityWidth{
  max-width: 200px;
  margin-right: 20px;
}
.tips{
  margin-left: 20px;
  font-size: 14px;
  margin-bottom: 20px;
  color: rgb(126, 87, 194);
}
.citychose{
  position: relative;
}
.loading{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
}
.actionBtn{
  width: 100%;
  text-align: right;
}
</style>