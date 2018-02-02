<template>
  <div class="initialize">
    <div class="topbox">
      <el-container>
        <el-aside width="60%">
                    <div class="right-container">
              <div>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">工单编号</label>
                    <div class="detail">{{proinfo.productionOrderNum}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">机型</label>
                    <div class="detail">{{proinfo.productModel}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">物料编号</label>
                    <div class="detail">{{proinfo.materialCode}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">订单编号</label>
                    <div class="detail">{{proinfo.productOrderNum}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">计划数量</label>
                    <div class="detail">{{proinfo.plannedQuantity}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">顺序号</label>
                    <div class="detail">{{proinfo.orderNo}}</div>
                  </el-col>
                </el-row>
                 <el-row :gutter="20">
                  <el-col :span="24">
                    <label class="label">发动机号</label>
                    <div class="detail">{{proinfo.serialNo}}</div>
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
    <div class="bottom-form">
      <el-table :data="tableData"  border style="width: 100%">
        <el-table-column prop="productOrderNum" label="订单编号" width="230">
        </el-table-column>
        <el-table-column prop="productionOrderNum" label="工单编号" width="230">
        </el-table-column>
        <!--<el-table-column prop="productModel" label="机型" width="100" >-->
        <!--</el-table-column>-->
        <el-table-column prop="materialCode" label="物料编码" width="140">
        </el-table-column>
        <!--<el-table-column prop="materialText" label="物料描述" width="200">-->
        <!--</el-table-column>-->
        <el-table-column prop="orderNo" label="顺序号" width="260">
        </el-table-column>
        <el-table-column prop="plannedQty" label="计划数量" width="162">
        </el-table-column>
      </el-table>
    </div>
    <!--<div class="fixed-box">-->
    <!--<span>手动初始化</span>-->
    <!--</div>-->
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
  </div>
</template>
<script>
import api from "../../utils/api.js";
import mqttLib from "../../utils/mqtt.js";
import httpserver from "../../utils/http.js";

export default {
  data() {
    return {
      StepDatas: [
        {
          title: "托盘已到位,正在请求订单数据！",
          // icon: "el-icon-edit",
          status: "wait"
        },
        {
          title: "请求数据成功！",
          // icon: "el-icon-success",
          status: "wait"
        },
        {
          title: "正在下发TAG数据！",
          // icon: "el-icon-download",
          status: "wait"
        },
        {
          title: "下发数据成功！",
          // icon: "el-icon-success",
          status: "wait"
        },
        {
          title: "初始化成功！",
          // icon: "el-icon-success",
          status: "wait"
        },
        {
          title: "工单开工！",
          // icon: "el-icon-success",
          status: "wait"
        }
      ],
      proinfo: {},
      number: 0,
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      gridData: [],
      total: 0
    };
  },
  computed: {},
  created() {
    this.getData();
    this.subscribe();
  },
  beforeDestroy: function() {
    this.unsubscribe();
  },
  methods: {
    getData: function() {
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workCenterCode: loc.workCenterCode,
        statuseCode: "7",
        endRow: 3
      };
      httpserver(api.getinitializeTable, body).then(res => {
        console.log("2222222222222");
        console.log(res);
        this.tableData = res.data.data;
        console.log(this.tableData);
      });
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
        if (response.data.returnCode == "0") {
          let resData = response.data.data;
          this.gridData = resData.productionStnRecords;
          this.total = resData.toalCount;
        }
      });
    },
    //      控制每页几条
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //      当前的页数
    handleCurrentChange(val) {
      console.log(val);
      this.dialogTableVisible = true;
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workStationCode: loc.workStationCode,
        pageNo: val,
        pageSize: "1"
      };
      httpserver(api.getHistoryInfo, body).then(response => {
        console.log(333);
        let resData = response.data.data;
        this.gridData = resData.productionStnRecords;
        this.total = resData.toalCount;
      });
    },
    subscribe() {
      let _this = this;
      let topic = "/logs/STN3010";
      mqttLib.subscribe(topic, "message");
      mqttLib.registerMessageHandler(topic, "message", function(message) {
        let data = JSON.parse(message.payloadString);
        console.log(data);
        let content = data.Content;
        let type = data.Type;
        if (type == "LOAD") {
          let step = content.Step;
          let log = content.Log;
          console.log(step);
          switch (step) {
            case "1":
              _this.number = 1;
              _this.StepDatas[_this.number].status = "wait";
              _this.StepDatas[_this.number + 1].status = "wait";
              _this.StepDatas[_this.number + 2].status = "wait";
              _this.StepDatas[_this.number + 3].status = "wait";
              _this.StepDatas[_this.number + 4].status = "wait";
              _this.StepDatas[_this.number - 1].status = "success";
              _this.StepDatas[_this.number - 1].title = log;
              break;
            case "2":
              _this.number = 2;
              _this.StepDatas[_this.number - 1].status = "success";
              _this.StepDatas[_this.number - 1].title = log;
              break;
            case "3":
              _this.number = 3;
              _this.StepDatas[_this.number - 1].status = "success";
              _this.StepDatas[_this.number - 1].title = log;
              break;
            case "4":
              _this.number = 4;
              _this.StepDatas[_this.number - 1].status = "success";
              _this.StepDatas[_this.number - 1].title = log;
              break;
            case "5":
              _this.number = 5;
              _this.StepDatas[_this.number - 1].status = "success";
              _this.StepDatas[_this.number - 1].title = log;
              break;
            case "6":
              _this.number = 6;
              _this.StepDatas[_this.number - 1].status = "success";
              _this.StepDatas[_this.number - 1].title = log;
              break;
            default:
              _this.StepDatas[_this.number].status = "error";
              _this.StepDatas[_this.number].title = log;
          }
        } else {
          let productionOrderNum = content.Data;
          let body2 = {
            productionOrderNum: productionOrderNum
          };
          httpserver(api.getCurrentProductionOrder, body2).then(response => {
            _this.proinfo = response.data.data;
          });
        }
      });
    },
    unsubscribe() {
      let topic = "/logs";
      mqttLib.unsubscribe(topic, "message");
    }
  }
};
</script>
<style lang="less">
@import "../../css/initialize/initialize.less";
body {
  margin: 0;
}
</style>
