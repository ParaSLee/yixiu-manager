<template>
<div>
  <mu-dialog :open="dialog" title="商户详情" @close="close" scrollable>   
    <p class="dialogBox">
      <span class="messageTitle">商户ID：</span> 
      {{ shopData._id }}
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户身份证：</span> 
      <!-- {{ shopData.name }} -->
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户名：</span> 
      {{ shopData.name }}
    </p>
    
    <p class="dialogBox">
      <span class="messageTitle">商户封面：</span> 
      <img :src="shopData.cover" class="cover">
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户联系方式：</span> 
      {{ shopData.contactNumber }}
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户创立时间：</span> 
      {{ shopData.time }}
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户评分：</span> 
      {{ shopData.score }}
    </p>
    <p class="dialogBox">
      <span class="messageTitle">商户证书：</span> 
      <span>
        <van-uploader :after-read="onRead" accept="image/gif, image/jpeg" multiple>
          <van-icon name="photograph" />
        </van-uploader>
        <!-- <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/> -->
      </span>
      <span>
        {{ shopData.certificate }}
      </span>
    </p>
    <p class="dialogBox checkBox">
      <span class="messageTitle">商户状态：</span> 
      <span v-if="!changestateShow">
        <span v-if="shopData.qualification===false" class="wait">待审核</span>
        <span v-else-if="shopData.qualification===0" class="unpass">未通过</span>
        <span v-else-if="shopData.qualification===1" class="normal">正常</span>
        <mu-flat-button label="修改状态" class="demo-flat-button changestateBtn" @click="chosestate" />
      </span>
      <span v-else class="changestateBox">
        <mu-radio label="未通过" name="group" nativeValue="0" v-model="chosevalue" class="demo-radio"/>
        <mu-radio label="正常" name="group" nativeValue="1" v-model="chosevalue" class="demo-radio"/>
        
        <mu-raised-button label="取消" class="demo-raised-button" @click="closechosestate" />
        <mu-raised-button label="更新" class="demo-raised-button" @click="changestate" primary/>
      </span>
    </p>
    <mu-flat-button slot="actions" @click="close" primary label="关闭"/>
  </mu-dialog>

</div>
</template>

<script>
import { Uploader, Icon } from 'vant';
import { changeState } from '../../common/api'
import axios from 'axios'

  export default {
    props:{
      shopData:Object,
      dialog:Boolean
    },
    data(){
      return {
        chosevalue:-1,
        changestateShow:false,
        shop:{
          qualification: null
        }
      }
    },
    components: {
      [Uploader.name]: Uploader,
      [Icon.name]: Icon
    },
    methods: {
      // update(e){
      //   var self = this
      //   let file = e.target.files[0]
      //   /* eslint-disable no-undef */
      //   let param = new FormData() // 创建form对象
      //   param.append('file', file, file.name) // 通过append向form对象添加数据
      //   param.append('_id', this.shopData._id) // 添加form表单中其他数据
      //   console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      //   console.log(param.get('_id')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去

      //   // this.pushCertificate.file = new FormData();
      //   // this.pushCertificate.file.append('file', file, file.name)

      //   // this.pushCertificate.file = param;
      //   // this.pushCertificate._id = this.shopData._id;

      //   let config = {
      //     headers: {'Content-Type': 'multipart/form-data'}
      //   }
      //   axios.post('https://yixiu.natappvip.cc/upload/shop/certificate/', param, config)
      //   .then(res => {
      //     console.log(res);
      //    // if (response.data.code === 0) {
      //    //  self.ImgUrl = response.data.data
      //    // }
      //    // console.log(response.data)
      //   })
      // },
      //关闭dialog
      close(){
        this.$emit("close")
      },
      //传递照片
      onRead(file,content){
        let fd = new FormData();

        fd.append('file', file.file);
        fd.append("_id", this.shopData._id);

        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        console.log(fd.get('_id'))
        axios.post('https://yixiu.natappvip.cc/upload/shop/certificate/', fd, config)
        .then(res => {
          console.log(res);
        })
      },
      //改变状态
      chosestate(){
        this.changestateShow = true;
      },
      //关闭更改状态
      closechosestate(){
        this.changestateShow = false;
        this.chosevalue = -1;
        this.shop.qualification = null;
      },
      //更新状态
      changestate(){
        if(this.chosevalue===false){
          alert("尚未选择");
        }else if (this.shop.qualification == this.chosevalue) {
          alert("没有改变状态")
        }else{
          this.shop.qualification = this.chosevalue;
          changeState(this.shop.qualification).then(res => {
            console.log(res)
          },(err => {
            console.log(err)
          }))
        }
        
        // changeState()
      }
    },
    created(){ 
      this.chosevalue = this.shopData.qualification;
      this.shop.qualification = this.chosevalue;
    }
  }
</script>

<style scoped>
  .dialogBox{
    font-size: 18px;
    margin-bottom: 5px;
    padding-bottom: 5px;
    border-bottom: 0.5px solid rgba(153, 153, 153,0.1);
  }
  .messageTitle{
    display: inline-block;
    text-align: right;
    width: 126px;
    margin-right: 5px;
  }
  .cover{
    max-width: 200px;
    max-height: 200px; 
  }
  .normal{
    color: #17B978;
  }
  .wait{
    color: #EC7700;
  }
  .unpass{
    color: #E43A19;
  }
  .changestateBtn{
    margin-left: 10px;
  }
  .checkBox{
    display: flex;
    align-items: center;
  }
  .changestateBox{
    display: flex;
    align-items: center;
  }
  .changestateBox label{
    margin-right: 10px;
  }
  .changestateBox button{
    margin-left: 10px;
  }
</style>