<template>

<div class="app-head">
  <div class="soft-icon">
    DMES-Client
  </div>
  <div class="interval">
    -
  </div>
  <div class="projectActive" v-if="title==''">
    {{menuText}}
  </div>
  <div class="projectActive" v-else="title!==''">
    {{title}}
  </div>
  <div class="sitecode">
    <div class="site-pic"></div>
    <div class="site">{{siteCode}}</div>
  </div>
  <div class="usercode">
    <div class="user-pic"></div>
    <div class="user">{{user}}</div>
  </div>

       <!--&lt;!&ndash; <img src="../../assets/logo.png">-->
       <!--<img src="../../assets/evun_logo.png"/> &ndash;&gt;-->
  <!--<el-row :gutter="20">-->
  <!--<el-col :span="8">-->
    <!--<label>{{$t('message.currentSite')}}</label>-->
    <!--<div class="site">{{siteCode}}</div>-->
  <!--</el-col>-->
  <!--<el-col :span="8">-->
<!--<label>{{$t('message.currentStation')}}</label>-->
<!--<div>{{station}}</div>-->
  <!--</el-col>-->
  <!--<el-col :span="8">-->
<!--<label>{{$t('message.currentUser')}}</label>-->
<!--<div>{{user}}</div>-->
  <!--</el-col>-->
<!--</el-row>-->
<!--<el-button type="primary" @click="switchChinese()">{{$t('message.cn')}}</el-button>-->
    <!--<el-button type="primary" @click="switchEnlish()">{{$t('message.en')}}</el-button>-->
</div>

</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      siteCode: JSON.parse(window.localStorage.getItem("terminal")).siteCode,
      station: "",
      user: window.localStorage.getItem("userCode"),
      menuText:''
    };
  },
  computed: {
    title () {
      return this.$store.state.title
    }
  },
  created() {
    this.getStation();
    this.getMenuTexts();
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
    },
    getMenuTexts(){
      this.menuText = window.localStorage.getItem("title")
      console.log(this.menuText)
    }

  }
};
</script>
<style lang="less" >
.app-head {
  height: 3.33rem;
  width: 100%;
  background: #2C619A 100%;
  /*box-shadow: 0px 1px 4px #ff5000;*/
  display: flex;
  align-items: center;
  position: relative;
  color: #fff;
  .soft-icon{
    font-family: EuropeCond-Bold-Italic;
    font-size: 1.6rem;
    color: #FFFFFF;
    margin-left: 24px;
  }
  .interval{
    margin-left: .5rem;
    margin-right: .5rem;
  }
  .projectActive{
    font-size: 1.2rem;
  }
  .sitecode {
    position: absolute;
    right: 130px;
    width: 70px;
    height: 25px;
    display: flex;
    position:;
    align-items: center;

.site-pic {
  background: url("../../assets/factory.png");
  width: 17px;
  height: 17px;
  margin-right: 8px;
}

.site {
  font-size: 1.2rem;
}

}
  .usercode{
    position: absolute;
    right: 24px;
    width: 80px;
    height: 25px;
    display: flex;
    position: ;
    align-items: center;
  .user-pic{
    background: url("../../assets/user.png");
    width: 17px;
    height: 17px;
    margin-right: 8px;
  }
  .user{
    font-size: 1.2rem;
  }
  }
}
</style>
