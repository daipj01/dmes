<!-- 底部栏 -->
<template>
  <div id="app-foot">
    <div class="btn-list">
      <div class="foot-btn f-cp icon-pad-menu" id="ment-list" v-on:click="menuClick()" style="color:#fff;">
      </div>
      <!--<router-link :to="{name:'消息'}">-->
        <div class="foot-btn f-cp icon-pad-message" v-on:click="getMessage()">
        </div>
      <!--</router-link>-->


      <div class="foot-btn f-cp icon-pad-fullscreen" v-on:click="requestFullScreen()">
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
    <div class="marquee_box">
      <ul class="marquee_list" :style="{ top: -num + 'px'}" :class="{marquee_top:num}">
        <!-- 当显示最后一条的时候（num=0转换布尔类型为false）去掉过渡效果-->
        <li v-for="(item, index) in marqueeList" >
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>

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
//   import config from '../../js/config'
  import getTime from '@/utils/timeFormat'
  import timer from '@/utils/timerManager'
  import httpserver from '../../utils/http.js';
  import api from '../../utils/api.js';
  import mqttLib from '../../utils/mqtt.js';

  export default {
    data() {
      return {
        fullscreen: true,
        messages: '',
        num:0,
        messageDialogVisible: false,
        sysdate: '',
        week: '',
        systime: '',
        isMenuShow: false,
        wifiStatus: '0',
        tabPosition: 'top',
        activeNames: ['1'],
        chooseTypeVal: 2,
        messageData:[
          {
            title:'11',
            message:'1111111',
            status:0
          },
          {
            title:'11',
            message:'1111111',
            status:0
          },
          {
            title:'11',
            message:'1111111',
            status:0
          },
          {
            title:'11',
            message:'1111111',
            status:0
          },
        ],
        isHasRead:false,
        animate:false,
        marqueeList: [
          {
            name:'1军',
          },
          {
            name:'2军',
          },
          {
            name:'3军',
          },
          {
            name:'4军',
          }
        ]
//        connectTime:0
      }
    },
    computed: {
      time:{
        set(val){
          this.$store.state.timer1 = val;
        },
        get() {
          return this.$store.state.timer1;
        }
      }
    },
    created() {
      let body = document.querySelector('body');
      body.addEventListener('click', (e) => {
        if (e.target.id !== 'ment-list') {
          this.isMenuShow = false;
        }
      }, false);
      this.getServertime();
      if ( this.time ) {
        clearInterval(this.time);
      }
      this.gettest();
      this.showMarquee(this.num)
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
      },
//      菜单
      menuClick() {
        this.isMenuShow = !this.isMenuShow
      },
      getMessage() {
        this.messageDialogVisible = true
      },
      gettest() {
        this.$store.state.timer1=window.setInterval(()=>{
        this.getServertime();
        },20000);
      },
//      时间+信号
      getServertime() {
        let _this = this;
       httpserver(api.getServertime)
          .then((response) => {
            let data = (new Date(response.data.data)).getTime();//转换为毫秒数
            const date = getTime.gettime(data);
            _this.sysdate = getTime.five(date);
            _this.week = date.week;
            window.setInterval(function () {
              data = data + 1000
              _this.systime = getTime.six(data)
            }, 1000)
          })
      },
      subscribe() {
        let _this = this;
        let topic = "/logs";
        console.log("begin----------");
        mqttLib.subscribe(topic, "message");
        mqttLib.registerMessageHandler(topic, "message", function (message) {
          _this.messages = message.payloadString;
          console.log(_this.messages);
        });
      },
      unsubscribe() {
        console.log("close----------");
        mqttLib.unsubscribe("/message", "message");
      },
      handleChange(val) {
        let order=val[val.length-1]
        this.messageData[order].status=1
      },
      haveRead(){
        this.isHasRead=true;
      },
      switchPane(e){
        this.chooseTypeVal = e === '全部' ? 2 : e === '已读' ? 1 : 0;
      },
      messlist2:function(list){
        return this.messageData.filter(function(item){
          return item.status==2
        })
      },
      messlist1:function(list){
        return this.messageData.filter(function(item){
          return item.status==1
        })
      },
      messlist0:function(list){
        return this.messageData.filter(function(item){
          return item.status==0
        })
      },
      showMarquee:function (num) {
        this.marqueeList.push(this.marqueeList[0]);
        var max = this.marqueeList.length;
        var that = this;
        marqueetimer =  setInterval(function(){
          num++;
          if(num>=max ){
            num=0;
          }
          that.num=num*30;
        }, 2000);
      }

    }
  }
</script>
<style lang="less">
  #app-foot {
    position: relative;
    height: 88px;
    width: 100%;
    box-shadow: 0px -2px 5px #cdcdcd;
    display: flex;
    color: #101110;
    font-weight:bold;
    background: rgba(182, 194, 199, 0.637);
    align-items: center;
    .btn-list {
      display: flex;
      flex: 1;
    }
    .system-info {
      .time {
        margin-right:10px;
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
      margin-top:-2rem;
    }
    .success {
      background: url("../../assets/WIFI-success.png");
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
    color: #FFF;
    border-radius: 5px;
    font-size: 20px;
  }

  #app-foot .el-button {
    margin-left: 3rem;
  }

  .icon-pad-menu:before {
    content: '';
  }

  #ment-list {
    /*background-color: red;*/
    background-image: url("../../assets/menu.png");
    background-size: 100% 100%;
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
    background: url("../../assets/message.png");
    background-size: 100% 100%;
  }

  .icon-pad-fullscreen {
    background: url("../../assets/fullscreen.png");
    background-size: 100% 100%;
  }
  .el-tabs{
    width: 100%;
    height: 19rem;
  }
  .el-tabs--border-card > .el-tabs__content{
    max-height: 13rem;
    overflow-y: auto;
  }
  .message-icon-read{
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../assets/notread.png");
    background-size: 100% 100%;
  }
  ul,li,span,img{
    margin:0;
    padding:0;
    /*display: flex;*/
    box-sizing: border-box;
  }

  .marquee{
    width: 100%;
    height: 50px;
    align-items: center;
    color: #3A3A3A;
    background-color: aqua;
    display: flex;
    box-sizing: border-box;
  }
  .marquee_title{
    padding: 0 20px;
    height: 30px;/*关键样式*/
    font-size: 14px;
    border-right: 1px solid #d8d8d8;
    align-items: center;
  }

  .marquee_box{
    display: block;
    position: relative;
    width: 60%;
    height: 30px;/*关键样式*/
    overflow: hidden;
  }
  .marquee_list{
    display: block;
    position: absolute;
    top:0;
    left: 0;
    width:80%;
  }
  .marquee_top{transition: top 0.5s ;}/*关键样式*/
  .marquee_list li{
    height: 30px;/*关键样式*/
    line-height: 30px;/*关键样式*/
    font-size: 14px;
    padding-left: 20px;
    background-color: #fff;
  }
  .marquee_list li span{
    padding:0 2px;
  }
  .red{
    color: #FF0101;
  }

</style>
