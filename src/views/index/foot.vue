<!-- 底部栏 -->
<template>
  <div id="app-foot">
    <div class="btn-list">
      <div class="foot-btn f-cp icon-pad-menu" id="ment-list" v-on:click="menuClick()" :class="isActive1?'blue':'dark'">
      </div>
        <div class="foot-btn f-cp icon-pad-message" v-on:click="getMessage()" :class="isActive2?'blue':'dark'">
        </div>
      <div class="foot-btn f-cp icon-pad-fullscreen" v-on:click="requestFullScreen()" :class="isActive3?'blue':'dark'">
      </div>
      <!--后台、mqtt推送的消息-->
      <el-dialog  :visible.sync="messageDialogVisible" width="80%" center>
        <el-tabs type="border-card">
          <el-tab-pane label="消息订阅">
            <el-collapse v-model="activeNames" @change="handleChange" v-if="this.chooseTypeVal==2">
              <el-collapse-item :title="item.title" :name="index" v-for="(item,index) in messageData" :key="index" >
                <template slot="title">
                  一致性 Consistency <i class="message-icon-read"></i>
                </template>
                <div>{{item.message}}</div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <!--<el-dialog title="测试消息" :visible.sync="messageDialogVisible" width="80%" center>-->
        <!--<span class="message">{{messages}}</span>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="subscribe()">订阅消息</el-button>-->
        <!--<el-button type="primary" @click="unsubscribe()">取消订阅</el-button>-->
        <!--</span>-->
      <!--</el-dialog>-->
    </div>
    <!--滚动显示消息-->
    <vue-seamless-scroll :data="listData" class="seamless-warp" :class-option="classOption">
      <ul class="item">
        <li v-for="item in listData">
          <span class="title" v-text="item.title"></span>
        </li>
      </ul>
    </vue-seamless-scroll>
    <div class="system-info" sw-role="cell">
      <div class="time" sw-role="cell" sw-mode="y" sw-valign="center">
        <div>{{systime}}</div>
        <div>{{sysdate}}/{{week}}</div>
      </div>
      <div class="signal" :class="wifiStatus=='0'?'success':'fail'">

      </div>
    </div>
    <navlist :isMenuShow='isMenuShow'></navlist>
  </div>
</template>
<script>
import getTime from "@/utils/timeFormat";
import timer from "@/utils/timerManager";
import httpserver from "../../utils/http.js";
import api from "../../utils/api.js";
import mqttLib from "../../utils/mqtt.js";

export default {
  data() {
    return {
      time1: "",
      time2: "",
      fullscreen: true,
      messages: "",
      num: 0,
      messageDialogVisible: false,
      sysdate: "",
      week: "",
      systime: "",
      isMenuShow: false,
      wifiStatus: "0",
      tabPosition: "top",
      activeNames: ["1"],
      chooseTypeVal: 2,
      isActive1:true,
      isActive2:false,
      isActive3:false,
      messageData: [
        {
          title: "11",
          message: "1111111",
          status: 0
        },
        {
          title: "11",
          message: "1111111",
          status: 0
        },
        {
          title: "11",
          message: "1111111",
          status: 0
        },
        {
          title: "11",
          message: "1111111",
          status: 0
        }
      ],
      isHasRead: false,
      animate: false,
      listData: [
        {
          title:
            "无缝滚动第一行无1111111111111111111111111111111111111111缝滚动第一行",
          date: "2017-12-16"
        }
      ]

      //        connectTime:0
    };
  },
  computed: {
    classOption() {
      return {
        step: 1, //the faster the rolling speed is faster
        limitMoveNum: 0, //start seamless scrolling minimum data  //this.dataList.length
        hoverStop: true, //mouse hover control is enabled
        direction: 2 // 0 down || 1 up || 2 left || 3 right
      };
    }
  },
  created() {
    let body = document.querySelector("body");
    body.addEventListener(
      "click",
      e => {
        if (e.target.id !== "ment-list") {
          this.isMenuShow = false;
        }
      },
      false
    );
    this.getServertime();
    this.detectNetwork();
    // this.gettest();
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {
    //      全屏
    requestFullScreen() {
      var element = document.documentElement;
      if (this.fullscreen == true) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
        this.fullscreen = !this.fullscreen;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        this.fullscreen = !this.fullscreen;
      }
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = true;
    },
    //      菜单
    menuClick() {
      this.isMenuShow = !this.isMenuShow;
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
    },
    getMessage() {
      this.messageDialogVisible = true;
      this.isActive1 = false;
      this.isActive2 = true;
      this.isActive3 = false;
    },
    //      时间+信号
    getServertime() {
      let _this = this;
      httpserver(api.getServertime).then(response => {
        let data = new Date(response.data.data).getTime(); //转换为毫秒数
        const date = getTime.gettime(data);
        _this.sysdate = getTime.five(date);
        _this.week = date.week;
        _this.time1 = window.setInterval(function() {
          data = data + 1000;
          _this.systime = getTime.six(data);
        }, 1000);
      });
    },
    //定时检测系统是否通信正常
    detectNetwork() {
       let _this = this;
      this.time2 = window.setInterval(function() {
        httpserver(api.getServertime).then(response => {
           let data = new Date(response.data.data).getTime(); //转换为毫秒数
        const date = getTime.gettime(data);
          _this.sysdate = getTime.five(date);
          _this.week = date.week;
        });
      }, 20000);
    },
    //清除定时器
    clear() {
      clearInterval(this.time1);
      clearInterval(this.time2);
    },
    //订阅消息
    subscribe() {
      let _this = this;
      let topic = "/logs";
      console.log("begin----------");
      mqttLib.subscribe(topic, "message");
      mqttLib.registerMessageHandler(topic, "message", function(message) {
        _this.messages = message.payloadString;
        console.log(_this.messages);
      });
    },
    //取消订阅
    unsubscribe() {
      console.log("close----------");
      mqttLib.unsubscribe("/message", "message");
    },
    handleChange(val) {
      let order = val[val.length - 1];
      this.messageData[order].status = 1;
    },
    haveRead() {
      this.isHasRead = true;
    },
    switchPane(e) {
      this.chooseTypeVal = e === "全部" ? 2 : e === "已读" ? 1 : 0;
    },
    messlist2: function(list) {
      return this.messageData.filter(function(item) {
        return item.status == 2;
      });
    },
    messlist1: function(list) {
      return this.messageData.filter(function(item) {
        return item.status == 1;
      });
    },
    messlist0: function(list) {
      return this.messageData.filter(function(item) {
        return item.status == 0;
      });
    },
//    切换颜色
    changeColor(){

    }

  }
};
</script>
<style lang="less">
#app-foot {
  position: relative;
  height: 5rem;
  width: 100%;
  box-shadow: 0px -2px 5px #cdcdcd;
  display: flex;
  color: #101110;
  font-weight: bold;
  background: #fff;
  align-items: center;
  .btn-list {
    display: flex;
    flex: 1;
  }
  .system-info {
    .time {
      margin-right: 10px;
      text-align: right;
      font-size: 16px;
    }
  }
  .signal {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    margin-right: 9rem;
    margin-top: -2rem;
  }
  .success {
    background: url("../../assets/wifi.png");
    background-size: 100% 100%;
  }
  .fail {
    background: url("../../assets/WIFI-faile.png");
    background-size: 100% 100%;
  }
  .el-checkbox-group label {
    margin-left: 15px;
  }
  .form-content {
    width: 100%;
    height: 400px;
    overflow: auto;
    margin-bottom: 20px;
    .btn {
      position: absolute;
      bottom: -10px;
    }
  }
}

.title {
  flex: 1;
}

.foot-btn {
  margin-left: 20px;
}

.foot-btn {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  font-size: 20px;
}

#app-foot .el-button {
  margin-left: 3rem;
}

.icon-pad-menu:before {
  content: "";
}

#ment-list {
  /*background-color: #0067B2;*/
  background-image: url("../../assets/menulist.png");
  background-size: 65% 65%;
  background-position: center center;
  background-repeat: no-repeat;


}

#nav-menu-list .bottom-con span {
  background-image: url("../../assets/layout.png");
}

#app-foot .el-dialog {
  height: 30rem;
  .el-dialog__header {
    .el-dialog__title {
      font-family: "Bell MT";
      font-size: 2rem;
      color: blue;
    }
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-dialog__body {
    height: 10rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .message {
    font-family: "Bell MT";
    font-size: 2rem;
    color: darkred;
  }
}

.icon-pad-message {
  background: url("../../assets/message1.png");
  background-size: 65% 65%;
  background-position: center center;
  background-repeat: no-repeat;
}

.icon-pad-fullscreen {
  background: url("../../assets/fullscreen1.png");
  background-size: 65% 65%;
  background-position: center center;
  background-repeat: no-repeat;
}
.el-tabs {
  width: 100%;
  height: 19rem;
}
.el-tabs--border-card > .el-tabs__content {
  max-height: 13rem;
  overflow-y: auto;
}
.message-icon-read {
  width: 1.5rem;
  height: 1.5rem;
  background: url("../../assets/notread.png");
  background-size: 100% 100%;
}
/*ul,li,span,img{*/
/*margin:0;*/
/*padding:0;*/
/*!*display: flex;*!*/
/*box-sizing: border-box;*/
/*}*/

.marquee {
  width: 100%;
  height: 50px;
  align-items: center;
  color: #3a3a3a;
  background-color: aqua;
  display: flex;
  box-sizing: border-box;
}
.marquee_title {
  padding: 0 20px;
  height: 30px; /*关键样式*/
  font-size: 14px;
  border-right: 1px solid #d8d8d8;
  align-items: center;
}

.marquee_box {
  display: block;
  position: relative;
  width: 60%;
  height: 30px; /*关键样式*/
  overflow: hidden;
}
.marquee_list {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 80%;
}
.marquee_top {
  transition: left 0.5s;
} /*关键样式*/
.marquee_list li {
  height: 30px; /*关键样式*/
  line-height: 30px; /*关键样式*/
  font-size: 14px;
  padding-left: 20px;
  background-color: #fff;
}
.marquee_list li span {
  padding: 0 2px;
}
.red {
  color: #ff0101;
}
.item li {
  float: left;
}
.seamless-warp {
  overflow: hidden;
  margin-right: 2rem;
  height: 3rem;
  /*font-size: 14px;*/
}
.seamless-warp > div {
  font-size: 18px;
  line-height: 1;
}
.blue{
  background-color: #0067B2;
}
  .dark{
    background-color: #717F9F;
  }
</style>
