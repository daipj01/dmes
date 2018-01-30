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
                    <div class="detail"></div>
                  </el-col>
                </el-row>
              </div>
            </div>
                </el-aside>
        <el-main>
          <div class="progress">
            <div class="container">
              <!-- <el-steps direction="vertical" :active=index>
                <el-step title="托盘已到位,准备初始化！" description=""></el-step>
                <el-step title="正在请求订单数据！" description=""></el-step>
                <el-step title="正在下发TAG数据！" description=""></el-step>
                <el-step title="初始化成功！" description=""></el-step>
              </el-steps> -->
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
        { title: "托盘已到位,正在请求订单数据！", icon: "el-icon-edit" },
        { title: "正在下发TAG数据！", icon: "el-icon-download" },
        { title: "初始化成功！", icon: "el-icon-success" }
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
        this.tableData = res.data.data;
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
        let record = JSON.parse(message.payloadString).Content.Step;
        let data = JSON.parse(message.payloadString).Content.Data;
        let log = JSON.parse(message.payloadString).Content.Log;
        console.log(message.payloadString);
        switch (record) {
          case "Ready":
            _this.number = 1;
            _this.StepDatas[_this.number - 1].title = log;
            break;
          case "Download":
            _this.number = 2;
            _this.StepDatas[_this.number - 1].title = log;
            let body2 = {
              workOrderNum: data
            };
            httpserver(api.getCurrentProductionOrder, body2).then(response => {
              _this.proinfo = response.data.data;
            });
            break;
          case "Complete":
            _this.number = 3;
            _this.StepDatas[_this.number - 1].title = log;
            _this.$options.methods.getData();
            break;
          default:
            _this.StepDatas[_this.number - 1].title = log;
            _this.StepDatas[_this.number - 1].description = "ERROR!!!";
            _this.StepDatas[_this.number - 1].icon = "el-icon-error";
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
