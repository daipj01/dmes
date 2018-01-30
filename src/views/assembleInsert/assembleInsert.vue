<template>
  <div class="assembleInsert">
    <div class="convent">
      <div class="convent-input">
        <span style="width: 8rem;font-size: 1.4rem;font-weight: bold;color:#000000">发动机号</span>
        <el-input :autosize="{ minRows: 4, maxRows: 4}" size="80" @keyup.enter.native="show($event)" v-model="code">

        </el-input>
        <el-button type="primary" @click="getSerialNoInformation()">确定</el-button>
      </div>
      <el-button type="success">已扫数量：{{productCount}}</el-button>
    </div>
    <div class="topbox">
      <el-container>
        <el-aside width="60%">
                    <div class="right-container">
              <div>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">订单编号</label>
                    <div class="detail">{{gridData.productOrderNum}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">工单编号</label>
                    <div class="detail">{{gridData.productionOrderNum}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <label class="label">发动机号</label>
                    <div class="detail">{{gridData.serialNo}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <label class="label">产品描述</label>
                    <div class="detail">{{gridData.materialText}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">产品编号</label>
                    <div class="detail">{{gridData.materialCode}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">机型</label>
                    <div class="detail">{{gridData.productModel}}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
                </el-aside>
        <el-main>
          <div class="progress">
            <div class="container">
              <el-steps ref="steps" direction="vertical" :active=number>
                <!-- <el-step title="" description="" icon="el-icon-edit"></el-step>
                <el-step title="" description="" icon="el-icon-upload"></el-step>
                <el-step title="" description="" icon="el-icon-picture"></el-step> -->
                <el-step v-for="(stepData,index) in StepDatas"
                :icon="stepData.icon"
                :title="stepData.title"
                :description="stepData.description"
                :key="index"
                ></el-step>
              </el-steps>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
    <div class="icon-pad-history" @click="getHistoryInfo()">
    </div>
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
    <div class="bottom-box">
      <div id="ishotTest">需要热试</div>
    </div>
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
        { title: "托盘已到位,准备读取数据", icon: "el-icon-edit" },
        { title: "正在读取数据", icon: "el-icon-upload" },
        { title: "读取数据成功", icon: "el-icon-success" }
      ],
      title: "111",
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
    subscribe() {
      let _this = this;
      let topic = "/logs/STN3010";
      mqttLib.subscribe(topic, "message");
      mqttLib.registerMessageHandler(topic, "message", function(message) {
        console.log(message.payloadString);
        let step = JSON.parse(message.payloadString).Content.Step;
        let log = JSON.parse(message.payloadString).Content.Log;
        switch (step) {
          case "Read":
            _this.number = 1;
            _this.StepDatas[_this.number - 1].title = log;
            break;
          case "Upload":
            _this.number = 2;
            _this.StepDatas[_this.number - 1].title = log;
            break;
          case "Completed":
            _this.number = 3;
            _this.StepDatas[_this.number - 1].title = log;
            break;
          default:
            _this.StepDatas[_this.number - 1].title = log;
            _this.StepDatas[_this.number - 1].description = "ERROR!请手动操作!";
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
            return console.log("Error opening port:", error.message);
          } else {
            this.$message({
              message: "窗口打开成功",
              type: "success"
            });
          }
        });
        parser.on("data", function(data) {
          _this.code = data;
        });
        _this.serialPort = port;
      } catch (err) {
        // console.log(err);
      } finally {
        this.$message({
          message: "窗口打开失败",
          type: "error"
        });
      }
    },
    closeCom() {
      try {
        if (this.serialPort.isOpen) {
          let _this = this;
          _this.serialPort.close(function(err) {
            if (err) {
              console.log(err);
            } else {
              this.$message({
                message: "串口关闭成功",
                type: "sussess"
              });
            }
          });
        }
      } catch (err) {
        // console.log(err);
      } finally {
        this.$message({
          message: "串口关闭失败",
          type: "error"
        });
      }
    },
    getSerialNoInformation() {
      let body = {
        serialNo: this.code
      };
      httpserver(api.getSerialNoInformation, body).then(res => {
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
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "../../css/assmbleInsert/assembleInsert.less";
</style>
