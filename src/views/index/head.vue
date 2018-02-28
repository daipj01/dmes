<template>
<div class="app-head">
       <!-- <img src="../../assets/logo.png">
       <img src="../../assets/evun_logo.png"/> -->
  <el-row :gutter="20">
  <el-col :span="8">
    <label>{{$t('message.currentSite')}}</label>
    <div class="site">{{siteCode}}</div>
  </el-col>
  <el-col :span="8">
<label>{{$t('message.currentStation')}}</label>
<div>{{station}}</div>
  </el-col>
  <el-col :span="8">
<label>{{$t('message.currentUser')}}</label>
<div>{{user}}</div>
  </el-col>
</el-row>
<el-button type="primary" @click="switchChinese()">{{$t('message.cn')}}</el-button>
    <el-button type="primary" @click="switchEnlish()">{{$t('message.en')}}</el-button>
</div>

</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      siteCode: JSON.parse(window.localStorage.getItem("terminal")).siteCode,
      station: "",
      user: window.localStorage.getItem("userCode")
    };
  },
  created() {
    this.getStation();
  },
  methods: {
    getStation() {
      // this.station=this.$store.state.station
    },
     switchChinese () {
      this.$i18n.locale = 'cn'
    },
    switchEnlish () {
      this.$i18n.locale = 'en'
    }
  }
};
</script>
<style lang="less" >
.app-head {
  height: 80px;
  width: 100%;
  background: rgba(3, 53, 77, 0.637);
  box-shadow: 0px 1px 4px #ff5000;
  display: flex;
  align-items: center;
  color: #fff;
  // img:nth-child(1) {
  //   margin-top: -2rem;
  //   margin-left: 1rem;
  //   display: inline-block;
  //   vertical-align: middle;
  // }
  // img:nth-child(2) {
  //   margin-top: -2rem;
  //   margin-left: 730px;
  //   display: inline-block;
  //   vertical-align: middle;
  // }
  .el-row {
    color: rgb(108, 216, 7);
    margin-top: 40px;
    height: 40px;
    width: 100%;
    .el-col {
      height: 40px;
    }
  }
}
</style>
