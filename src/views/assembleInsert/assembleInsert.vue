<template>
  <div class="assembleInsert">
    <div class="convent">
      <div class="convent-input">
        <span style="width: 8rem;font-size: 1.4rem;color: #595959;margin-right: 1rem">{{$t('message.serialNo')}}</span>
        <el-input :autosize="{ minRows: 4, maxRows: 4}" size="80" @keyup.enter.native="show($event)" v-model="code">
          <template slot="append" @click="getSerialNoInformation()">{{$t('message.fix')}}</template>
        </el-input>
      </div>
      <div class="counts">
        <span style="font-size: 18px;color: #515152;vertical-align: middle;float:left;margin-left: 1.5rem;">{{$t('message.scanned')}}</span>
        <span style="font-size: 36px;color: #00AFEB;vertical-align: middle;float: left;margin-left:10px;">{{productCount}}</span>
      </div>
    </div>
    <div class="topbox">
      <el-container>
        <el-aside width="60%">
          <div class="right-container">
              <div>
                <el-row :gutter="20">
                  <el-col :span="14">
                    <label class="label">{{$t('message.productOrderNum')}}</label>
                    <div class="detail">{{gridData.productOrderNum}}</div>
                  </el-col>
                  <el-col :span="10">
                    <label class="label">{{$t('message.productionOrderNum')}}</label>
                    <div class="detail">{{gridData.productionOrderNum}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <label class="label">{{$t('message.materialText')}}</label>
                    <div class="detail">{{gridData.materialText}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">{{$t('message.materialCode')}}</label>
                    <div class="detail">{{gridData.materialCode}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">{{$t('message.productModel')}}</label>
                    <div class="detail">{{gridData.productModel}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <label class="label">{{$t('message.serialNo')}}</label>
                    <div class="detail">{{gridData.serialNo}}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
                </el-aside>
        <el-main>
          <div class="progress">
            <div class="container">
              <el-steps ref="steps" direction="vertical" :active=number>
                <el-step v-for="(stepData,index) in StepDatas"
                :icon="stepData.icon"
                :title="stepData.title"
                :key="index"
                :status="stepData.status"
                ></el-step>
              </el-steps>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
    <div class="icon-pad-history" @click="getHistoryInfo()">
    </div>
    <!--历史记录-->
    <div class="history-info">
      <el-dialog :visible.sync="dialogTableVisible" width="80%">
        <el-table :data="gridData">
          <el-table-column prop="productOrderNum" label="订单编号">
          </el-table-column>
          <el-table-column prop="productionOrderNum" label="工单编号">
          </el-table-column>
          <el-table-column prop="productModel" label="机型">
          </el-table-column>
          <el-table-column prop="materialCode" label="物料编码">
          </el-table-column>
          <el-table-column prop="materialText" label="物料描述">
          </el-table-column>
          <el-table-column prop="quanlity" label="计划数量">
          </el-table-column>
          <el-table-column prop="orderNo" label="顺序号">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1]"
          :page-size="1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-dialog>
    </div>

    <!--<div class="bottom-box">-->
      <!--<div id="ishotTest">需要热试</div>-->
    <!--</div>-->
  </div>
</template>

<script type="text/babel">
import httpserver from "../../utils/http.js";
import api from "../../utils/api.js";
import mqttLib from "../../utils/mqtt.js";

export default {
  data() {
    return {
      StepDatas: [
        { title: "托盘已到位,准备读取数据", status: "wait" },
        { title: "正在读取数据", status: "wait" },
        { title: "读取数据成功,正在上传", status: "wait" },
        { title: "上传成功", status: "wait" },
        { title: "完成报工", status: "wait" }
      ],
      serialPort: "",
      name: "pro-gress",
      code: "",
      number: 0,
      dialogTableVisible: false,
      tableData: [],
      total: 0,
      gridData: [],
      productCount: 0
    };
  },
  beforeRouteLeave(to, from, next) {
    this.closeCom();
    next();
  },
  created() {
    this.subscribe();
    console.log("开始订阅消息");
  },
  mounted() {
    this.openCom();
  },
  beforeDestroy() {
    this.unsubscribe();
    console.log("取消订阅");
  },
  methods: {
    show: function(ev) {
      let _this = this;
      if (ev.keyCode == 13) {
        this.getSerialNoInformation();
      }
    },
    subscribe() {
      let _this = this;
      let topic = "/logs/STN3010";
      mqttLib.subscribe(topic, "message");
      mqttLib.registerMessageHandler(topic, "message", function(message) {
        console.log(message.payloadString);
        let step = JSON.parse(message.payloadString).Content.Step;
        let log = JSON.parse(message.payloadString).Content.Log;
        switch (step) {
          case "1":
            _this.number = 1;
            _this.StepDatas.forEach(function(value, index, array) {
              array[index].status = "wait";
            });
            _this.StepDatas[0].status = "success";
            _this.StepDatas[0].title = log;
            break;
          case "2":
            _this.number = 2;
            _this.StepDatas[1].status = "success";
            _this.StepDatas[1].title = log;
            break;
          case "3":
            _this.number = 3;
            _this.StepDatas[2].status = "success";
            _this.StepDatas[2].title = log;
            break;
          case "4":
            _this.number = 4;
            _this.StepDatas[3].status = "success";
            _this.StepDatas[3].title = log;
            break;
          case "5":
            _this.number = 5;
            _this.StepDatas[4].status = "success";
            _this.StepDatas[4].title = log;
            break;
          default:
            _this.StepDatas[_this.number].title = log;
            _this.StepDatas[_this.number].status = "error";
        }
      });
    },
    unsubscribe() {
      let topic = "/logs";
      mqttLib.unsubscribe(topic, "message");
    },
    getHistoryInfo() {
      this.dialogTableVisible = true;
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workStationCode: loc.workStationCode,
        pageNo: "1",
        pageSize: "1"
      };
      httpserver(api.getHistoryInfo, body).then(response => {
        let resData = response.data.data;
        this.gridData = resData.productionStnRecords;
        this.total = resData.toalCount;
      });
    },
    //      控制每页几条
    handleSizeChange(val) {},
    //      当前的页数
    handleCurrentChange(val) {
      this.dialogTableVisible = true;
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workStationCode: loc.workStationCode,
        pageNo: val,
        pageSize: "1"
      };
      httpserver(api.getHistoryInfo, body).then(response => {
        let resData = response.data.data;
        this.gridData = resData.productionStnRecords;
        this.total = resData.toalCount;
      });
    },
   openCom() {
      try {
        let _this = this;
        let port = new SerialPort(
          JSON.parse(window.localStorage.getItem("serialPort")).port,
          { autoOpen: false }
        );
        let Readline = SerialPort.parsers.Readline;
        let parser = new Readline();
        port.pipe(parser);
        port.open(function(error) {
          if (error) {
            console.log(error);
            _this.$message({
              message: "串口打开失败",
              type: "error"
            });
            return console.log("Error opening port:", error);
          } else {
            _this.$message({
              message: "串口打开成功",
              type: "success"
            });
          }
        });
        parser.on("data", function(data) {
          _this.code = data;
        });
        _this.serialPort = port;
      } catch (err) {
        //console.log(err);
      }
    },
    closeCom() {
      try {
        if (this.serialPort.isOpen) {
          let _this = this;
          _this.serialPort.close(function(err) {
            if (err) {
              console.log(err);
              _this.$message({
                message: "串口关闭失败",
                type: "error"
              });
            } else {
              _this.$message({
                message: "串口关闭成功",
                type: "success"
              });
            }
          });
        }
      } catch (err) {
        // console.log(err);
      }
    },
    getSerialNoInformation() {
      let body = {
        serialNo: this.code
      };
      httpserver(api.productionStatusChange, body).then(res => {
        //6947463266069
        if (res.data.returnCode == "0") {
          this.gridData = res.data.data;
          this.productCount++;
          if (res.data.data.hotTest == "0") {
            console.log(
              (document.getElementById("ishotTest").style.display = "flex")
            );
          }
        } else {
          document.getElementById("ishotTest").style.display = "";
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "../../css/assmbleInsert/assembleInsert.less";
</style>
