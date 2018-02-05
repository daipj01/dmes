<!-- 登录页 -->
<template>
<div class="login11">
<div class="login">
<header>
  <h1>DMES</h1>
</header>
 <div class="sr">
            <el-form ref="form" :model="form">
            <el-form-item prop="userCode" :rules=rule.nameRule>
              <el-input v-model="form.userCode" :autofocus=true ref="form.usrCode" placeholder="用户名" icon="pad-user"
                        @keyup.enter.native="onSubmit('form')"></el-input>
            </el-form-item>
            <el-form-item prop="password" :rules=rule.passwordRule>
              <el-input v-model="form.password" type="password" placeholder="密码" icon="pad-password"
                        @keyup.enter.native="onSubmit('form')"></el-input>
            </el-form-item>
            <el-form-item>
             <el-button type="primary"  @click="onSubmit('form')">登录</el-button>
            </el-form-item>
          </el-form>
	 </div>
</div>
</div>
</template>
<script>
import httpserver from "../../utils/http.js";
import api from "../../utils/api.js";
export default {
  data() {
    return {
      form: {
        userCode: "",
        password: "",
        siteCode: "2018"
      },
      MenuListData: [],
      rule: {
        nameRule: [{ required: true, message: "账号不能为空" }],
        passwordRule: [{ required: true, message: "密码不能为空" }]
      },
      loadingFlag: false
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let _this = this;
          httpserver(api.logIn, _this.form).then(response => {
            console.log(response);
            sessionStorage.setItem("userCode", _this.form.userCode);
            sessionStorage.setItem("password", _this.form.password);
            var menulist = JSON.stringify(response.data.data.menus);
            window.localStorage.setItem("list", menulist);
            window.localStorage.setItem(
              "sessionId",
              response.data.data.sessionId
            );
            window.localStorage.setItem(
              "terminal",
              JSON.stringify(response.data.data.terminal)
            );
            window.localStorage.setItem(
              "serialPort",
              JSON.stringify(response.data.data.serialPort)
            );
            if (response.data.returnCode == 0) {
              let serialPort = response.data.data.serialPort;
              if (
                serialPort == null ||
                serialPort == undefined ||
                serialPort == ""
              ) {
                console.log(serialPort);
                this.$router.push("/system");
              }
              // console.log(response.data.data.terminal.homePage);
              let homepage = response.data.data.terminal.homePage;
              if (homepage == null || homepage == undefined || homepage == "") {
                this.$message({
                  message: "请联系管理员配置首页！",
                  type: "warning"
                });
                this.$router.push("/home");
              } else {
                this.$router.push(response.data.data.terminal.homePage);
              }
            }
          });
        }
      });
    }
  }
};
</script>
 <style lang="less">
@keyframes cc {
  0% {
    opacity: 0.4;
    transform: scale(0.1);
    top: -500px;
  }
  50% {
    opacity: 0.4;
    transform: scale(0.1) rotateX(90deg);
    top: -50px;
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateX(0deg);
    top: 0;
  }
}
@media only screen and (max-width: 500px) {
  .login {
    width: 95% !important;
  }
  .sr {
    padding: 30px 70px !important;
  }
}
.login11 {
  display: flex;
  width: 100%;
  background: url("../../assets/loginbg1.png") no-repeat center center;
  background-size: cover;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
}
.login {
  width: 450px;
  position: relative;
  top: 0;
  margin: 15% auto;
  background: rgba(87, 173, 212, 0.637);
  border-radius: 10px;
  animation: cc 4s ease-in-out;
}
.login header {
  padding: 10px;
  border-bottom: 2px solid rgb(72, 109, 156);
}
.login header h1 {
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 25px;
  line-height: 40px;
}
.sr {
  padding: 60px 100px;
}
.el-input__inner {
  display: flex;
  height: 100%;
}
.el-input__inner{
  height:40px;
}
</style>
 
