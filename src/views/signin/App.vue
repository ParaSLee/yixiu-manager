<template>
  <div class="signin-container">
    <div class="signin-box">
      <h2 class="signin-title">登录</h2>
      <div class="signin-content">
        <p>账号：<span v-if="idText">{{idText}}</span></p>
        <input type="text" v-model="id">
      </div>
      <div class="signin-content">
        <p>密码：<span v-if="passwordText">{{passwordText}}</span></p>
        <input type="password" v-model="password">
      </div>
      <div class="signin-content" @click="login">
        <button>登录</button>
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
  import { managerlogin } from '../common/api'

  export default {
    data(){
      return {
        idText:"",
        passwordText:"",
        loading:false,
        id:"",
        password:""
      }
    },
    components: {
      [Loading.name]: Loading,
    },
    methods: {
      login(){
        this.loading = true;
        if (this.id==="" && this.password==="") {
          this.idText="用户名不能为空";
          this.passwordText="密码不能为空";
        }else if (this.id==="") {
          this.idText="用户名不能为空";
          this.passwordText="";
        }else if(this.password===""){
          this.idText="";
          this.passwordText="密码不能为空";
        }else{
          this.idText="";
          this.passwordText="";
          let accound = {
            username: this.id,
            password: md5(this.password)
          }

          managerlogin(accound).then(res => {
            if (res.errMsg == "用户不存在") {
              this.idText="用户不存在";
              this.passwordText="";
            }else if(res.errMsg == "密码错误"){
              this.idText="";
              this.passwordText="密码错误";
            }else{
              this.$router.push("/home")
            }
          },(err => {
            console.log(err)
          }))
        }
        this.loading = false;
      }
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
    margin-top: -210px;
    height: 420px;
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
  

</style>