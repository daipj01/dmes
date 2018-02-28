<template>
<div class="initialize">
<div class="topbox">
  <el-container>
    <el-aside width="60%">
      <div class="right-container">
      <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">{{$t('message.productionOrderNum')}}</label>
                    <div class="detail">{{proinfo.productionOrderNum}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">{{$t('message.productModel')}}</label>
                    <div class="detail">{{proinfo.productModel}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">{{$t('message.materialCode')}}</label>
                    <div class="detail">{{proinfo.materialCode}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">{{$t('message.productOrderNum')}}</label>
                    <div class="detail">{{proinfo.productOrderNum}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">{{$t('message.plannedQuantity')}}</label>
                    <div class="detail">{{proinfo.plannedQuantity}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">{{$t('message.orderNo')}}</label>
                    <div class="detail">{{proinfo.orderNo}}</div>
                  </el-col>
                </el-row>
                 <el-row :gutter="20">
                  <el-col :span="24">
                    <label class="label">{{$t('message.serialNo')}}</label>
                    <div class="detail">{{proinfo.serialNo}}</div>
                  </el-col>
                </el-row>
      </div>
    </el-aside>
    <el-main>
      <div class="progress">
        <div class="container">
          <el-steps direction="vertical" :active=number>
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
  <el-table :data="tableData" style="width:100%">
    <el-table-column prop="productOrderNum"  :label="$t('message.productOrderNum')" width="225">
        </el-table-column>
        <el-table-column prop="productionOrderNum" :label="$t('message.productionOrderNum')"  width="245">
        </el-table-column>
        <el-table-column prop="materialCode" :label="$t('message.materialCode')" width="140">
        </el-table-column>
        <el-table-column prop="orderNo" :label="$t('message.orderNo')" width="260">
        </el-table-column>
        <el-table-column prop="plannedQty" :label="$t('message.plannedQuantity')" width="162">
        </el-table-column>
  </el-table>
</div>
 <div class="icon-pad-history" @click="getHistoryInfo()">
    </div>
    <el-dialog :visible.sync="dialogTableVisible" width="80%">
      <el-table :data="gridData">
        <el-table-column prop="productOrderNum" :label="$t('message.productOrderNum')">
        </el-table-column>
        <el-table-column prop="productionOrderNum" :label="$t('message.productionOrderNum')">
        </el-table-column>
        <el-table-column prop="productModel" :label="$t('message.productModel')">
        </el-table-column>
        <el-table-column prop="materialCode" :label="$t('message.materialCode')">
        </el-table-column>
        <el-table-column prop="materialText" :label="$t('message.materialText')">
        </el-table-column>
        <el-table-column prop="quanlity" :label="$t('message.plannedQuantity')">
        </el-table-column>
        <el-table-column prop="orderNo" :label="$t('message.orderNo')">
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
      tableData: [],
      proinfo: {},
      number: 0,
      dialogTableVisible: false,
      gridData: [],
      total: 0,
      StepDatas: [
        {
          title: "托盘已到位,正在请求订单数据！",
          status: "wait"
        },
        {
          title: "请求数据成功！",
          status: "wait"
        },
        {
          title: "正在下发TAG数据！",
          status: "wait"
        },
        {
          title: "下发数据成功！",
          status: "wait"
        },
        {
          title: "初始化成功！",
          status: "wait"
        },
        {
          title: "工单开工！",
          status: "wait"
        }
      ]
    };
  },
  created() {
    this.getProcutionOrderQueue();
    this.subscribe();
  },
  beforeDestroy: function() {
    this.unsubscribe();
  },
  methods: {
    getProcutionOrderQueue: function() {
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workCenterCode: loc.workCenterCode,
        statuseCode: "7",
        endRow: 2
      };
      httpserver(api.getProcutionOrderQueue, body).then(res => {
        this.tableData = res.data.data;
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
            case "6":
              _this.number = 6;
              _this.StepDatas[5].status = "success";
              _this.StepDatas[5].title = log;
              _this.getProcutionOrderQueue();
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
            if (_this.proinfo==null){
              _this.proinfo={}
            }
          });
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
        if (response.data.returnCode == "0") {
          let resData = response.data.data;
          this.gridData = resData.productionStnRecords;
          this.total = resData.toalCount;
        }
      });
    },
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
    }
  }
};
</script>

<style lang="less">
@import "../../css/initialize/initialize.less";
</style>
