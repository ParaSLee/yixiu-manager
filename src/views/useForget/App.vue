<template>
  <div class="signin-container">
    <div class="signin-box">
      <h2 class="signin-title">修改密码</h2>
      <p style="margin-left:50px;font-size:18px;">该功能暂时无法使用</p>
      <div class="signin-content">
        <p>手机号：<span v-if="idText">{{idText}}</span></p>
        <input type="text" v-model="id">
      </div>
      <div class="signin-content">
        <p>密码：<span v-if="passwordText">{{passwordText}}</span></p>
        <input type="password" v-model="password">
      </div>
      <div class="signin-content">
        <p>验证码：<span v-if="vercode">{{vercode}}</span></p>
        <input type="text" v-model="code">
        <button class="getCode" @click="getmessage" :disabled="LoadinggetMessaga" :class="LoadinggetMessaga?'cantgetCode':''">{{ getMessaga }}</button>
      </div>
      <div class="signin-content" @click="regin">
        <button>注册</button>
      </div>
      <div class="signin-content rigin" @click="backlogin">
        <button>返回登录</button>
      </div>

    </div>
    <div class="loadingBox"  v-if="loading">
      <div class="Loading">
        <van-loading color="black" size="70px"/>
      </div>
    </div>
    
  </div>
</template>

<script>
  //vant
  import { Loading } from 'vant';
  import md5 from "js-md5";
  import { useRegin,sendmessage } from '../common/api'

  export default {
    data(){
      return {
        LoadinggetMessaga: false,
        theTime:60,
        getMessaga: "获取验证码",
        idText:"",
        vercode:"",
        passwordText:"",
        loading:false,
        id:"",
        code:"",
        password:"",
        eCode:"",
      }
    },
    components: {
      [Loading.name]: Loading,
    },
    methods: {
      backlogin(){
        this.$router.push("/useSignin")
      },
      regin(){
        this.idText="";
        this.passwordText="";
        this.vercode="";

        let isOK = true;
        this.loading = true;
        if (this.code==="") {
          this.vercode="验证码不能为空";
          isOK = false;
        }
        
        if (this.id==="") {
          this.idText="手机号不能为空";
          isOK = false;
        }
        if(this.password===""){
          this.passwordText="密码不能为空";
          isOK = false;
        }
        if (isOK===true) {
          if (this.code!==this.eCode) {
            this.vercode="验证码错误";
            isOK = false;
          }else{
            let accound = {
              mobile: `${this.id}S`,
              password: md5(this.password)
            }

            useRegin(accound).then(res => {
                // console.log(res)
              if (res.errMsg == "手机号不存在") {
                this.idText="手机号不存在";
                this.passwordText="";
              }else if(res.errMsg == "密码错误"){
                this.idText="";
                this.passwordText="密码错误";
              }else if(!res.errMsg){
                sessionStorage.setItem('sign', true)
                this.$router.push("/useStatistics")
              }else{
                this.idText="不能使用该账号登录";
              }
            },(err => {
              console.log(err)
            }))
          }
        }
        this.loading = false;
      },
      getmessage(){
        if (!this.id) {
          this.idText="手机号不能为空";
        }else if(this.mobileReg(this.id)==false){
          this.idText="请输入正确的手机号";
        }else{
          this.idText="";
          let a = {
            mobile: this.id
          }
          /*
          sendmessage(a)
          .then(res => {
            // console.log(res)
            if (res.errMsg=="触发小时级流控Permits:5") {
              this.vercode="注册人数过多，请1小时后重试";
              this.LoadinggetMessaga = true;
            }else{
              this.eCode = res;
              this.LoadinggetMessaga = true;
              this.getMessaga = `${this.theTime}秒后重新发送`
              let inter = setInterval(() => {
                this.theTime -= 1;
                this.getMessaga = `${this.theTime}秒后重新发送`
                if (this.theTime == 0) {
                  this.getMessaga = "重新获取验证码";
                  this.LoadinggetMessaga = false;
                  clearInterval(inter)
                  this.theTime = 60;
                }
              },1000);
            }
          },(err => {
            console.log(err);
          }))
          */
        }
      },
    }
  }
</script>

<style scoped>
  .signin-container{
    position: absolute;
    height: 100%;
    width: 100%;
    background: #2C2C2C;
    overflow: hidden;
  }
  .signin-box{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -170px;
    margin-top: -280px;
    padding-bottom: 20px;
    /*height: 420px;*/
    width: 340px;
    background-color: #FCFCFC;
    -moz-box-shadow:0px 2px 1px #005792; 
    -webkit-box-shadow:0px 2px 1px #005792; 
    box-shadow:0px 2px 1px #005792;
  }
  .signin-title{
    margin: 0;
    padding: 0.4em 0 0.3em;
    text-align: center;
    font-weight: 300;
    font-size: 3.5em;
    color: #FF5F5F;
    font-family: "Microsoft YaHei"
  }
  .signin-content{
    position: relative;
    padding: 0px 30px 0 30px;
    margin-bottom: 5px;
  }
  .signin-content span{
    color: #FF5F5F
  }
  .signin-content p {
    display: block;
    padding: 10px 0 0;
    color: #BBBBBB;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    font-size: 1em;
    line-height: 1.75;
    text-align: left;    
  }
  .signin-content input{
    padding: 10px;
    width: 100%;
    height: 52px;
    border: 2px solid #BBBBBB;
    background: transparent;
    color: #b09a86;
    font-weight: 300;
    font-size: 2.2em;
    line-height: normal;
    box-sizing: border-box;
  }
  .signin-content input:focus{
    outline-color: #1989AC;
    border-color: #1989AC;
    color: #1989AC;
  }
  .signin-content button{
    display: block;
    height: 61px;
    width: 100%;
    border: none;
    margin-top: 30px;
    background: #FF5F5F;
    color: #f9f6e5;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 800;
    font-size: 1.25em;
    cursor: pointer;
  }
  .signin-content button:hover{
    background: #ff7873;
    color: #efecd6;
  }
  .rigin button{
    height: 45px;
    color: #1C1124;
    background: #E7EFF3;
  }
  .rigin button:hover{
    background: #dfe7ea;
    color: #0d0811;
  }
  .Loading{
    position: relative;
    top: 50%;
    left: 50%;
    margin-top: -35px;
    margin-left: -35px;
    border-radius: 50%;
    overflow: hidden;
    width: 70px;
    height: 70px;
    background-color: rgba(124, 124, 124, 1);
  }
  .loadingBox{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(124, 124, 124,0.2);
  }
  .signin-content .getCode{
    position: absolute;
    top: 0;
    right: 10px;
    width: 75px;
    font-size: 14px;
    background: rgb(186, 186, 186);
    font-weight: 500;
  }
  .signin-content .getCode:hover{
    background: rgb(31, 136, 171);
    color: #f9f6e5;
    font-weight: 600;
  }
  .signin-content .cantgetCode{
    background: rgb(186, 186, 186);
    cursor: default;
  }
  .signin-content .cantgetCode:hover{
    background: rgb(186, 186, 186);
    color: #f9f6e5;
    font-weight: 500;
  }
</style>