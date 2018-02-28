<template>
  <div class="machineplusOnline">
    <div class="convent">
      <div class="convent-input">
        <span style="width: 8rem;font-size: 1.4rem;color: #000000;font-weight: bold">{{$t('message.partbarcode')}}</span>
        <el-input :autosize="{ minRows: 4, maxRows: 4}" size="80" @keyup.enter.native="show($event)" v-model="code">
        </el-input>
        <el-button type="primary" @click="validplannedQty()">{{$t('message.fix')}}</el-button>
      </div>
      <el-button type="success">{{$t('message.scanned')}}:{{productCount}}</el-button>
    </div>
    <div class="topbox">
      <div id="currentorder" class="right-container">
        <el-row :gutter="20">
                  <el-col :span="8">
                    <label class="label">{{$t('message.productionOrderNum')}}</label>
                    <div class="detail">{{proinfo.productionOrderNum}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">{{$t('message.materialCode')}}</label>
                    <div class="detail">{{proinfo.materialCode}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">{{$t('message.materialText')}}</label>
                    <div class="detail">{{proinfo.materialText}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <label class="label">{{$t('message.productModel')}}</label>
                    <div class="detail">{{proinfo.productModel}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">{{$t('message.orderNo')}}</label>
                    <div class="detail">{{proinfo.orderNo}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">{{$t('message.plannedQuantity')}}</label>
                    <div class="detail">{{proinfo.plannedQty}}</div>
                  </el-col>
                </el-row>
      </div>
    </div>
    <div class="bottom-form">
      <el-table :data="tableData" border ref="table" style="width: 100%;" highlight-current-row
                @current-change="current">
        <el-table-column prop="orderNo" :label="$t('message.orderNo')"  width="240">
        </el-table-column>
        <el-table-column prop="productionOrderNum" :label="$t('message.productionOrderNum')"   width="230">
        </el-table-column>
        <el-table-column prop="materialCode" :label="$t('message.materialCode')"  width="180">
        </el-table-column>
        <el-table-column prop="plannedQty" :label="$t('message.plannedQuantity')"  width="180">
        </el-table-column>
        <el-table-column prop="scanQty" :label="$t('message.scanned')"  width="190">
        </el-table-column>
      </el-table>
    </div>
    <div class="history-info">
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
    <el-dialog
      title="注意"
      :visible.sync="centerDialogVisible"
      width="50%"
      top="30vh"
      :show-close="false"
      center>
      <span>已扫数量超出计划数量</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click=continueON()>继续</el-button>
    <el-button type="primary" @click="onFinish()">完成</el-button>
  </span>
    </el-dialog>
    <div class="icon-pad-history" @click="getHistoryInfo()">
    </div>
  </div>
</template>

<script type="text/babel">
import httpserver from "../../utils/http.js";
import api from "../../utils/api.js";

export default {
  data() {
    return {
      centerDialogVisible: false,
      productionOrderNum: "",
      tableData: [],
      gridData: [],
      proinfo: {},
      plannedQty: 0,
      code: "",
      productCount: 0,
      dialogTableVisible: false,
      currentRow: null,
      serialPort: "",
      total: 0
    };
  },
  beforeRouteLeave(to, from, next) {
    this.closeCom();
    next();
  },
  created() {
    this.getMachiningProductionQueue();
  },
  mounted() {
    this.openCom();
  },
  methods: {
    show: function(ev) {
      let _this = this;
      if (ev.keyCode == 13) {
        this.validplannedQty();
      }
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
    setCurrent(row) {
      this.$refs.table.setCurrentRow(row);
    },
    validplannedQty() {
      if (this.productCount < this.plannedQty) {
        this.validMachiningProductRecord();
      } else {
        this.centerDialogVisible = true;
      }
    },
    continueON() {
      this.centerDialogVisible = false;
      this.validMachiningProductRecord();
    },
    onFinish() {
      this.centerDialogVisible = false;
      let body = {
        productionOrderNum: this.productionOrderNum
      };
      this.$confirm("确认完成该工单？")
        .then(_ => {
          httpserver(api.updateMachiningProduction, body).then(res => {
            if (res.data.returnCode == "0") {
              this.getMachiningProductionQueue();
            }
          });
        })
        .catch(_ => {});
    },
    validMachiningProductRecord() {
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workStationCode: loc.workStationCode,
        scanCode: this.code,
        productionOrderNum: this.productionOrderNum
      };
      httpserver(api.validMachiningProductRecord, body).then(response => {
        console.log(response);
        if (response.data.returnCode == "0") {
          this.productCount++;
          this.getMachiningProductionQueue();
        }
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
        let resData = response.data.data;
        this.gridData = resData.productionStnRecords;
      });
    },
    getMachiningProductionQueue: function() {
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workCenterCode: loc.workCenterCode,
        endRow: 3
      };
      httpserver(api.getMachiningProductionQueue, body).then(res => {
        this.tableData = res.data.data;
      });
    },
    current(val, old) {
      if (val != null) {
        this.currentRow = val;
        this.proinfo = val;
        this.productCount = this.currentRow.scanQty;
        this.plannedQty = this.currentRow.plannedQty;
        this.productionOrderNum = this.currentRow.productionOrderNum;
      } else {
        this.tableData.forEach((value, index, table) => {
          if (table[index].productionOrderNum == old.productionOrderNum) {
            this.setCurrent(this.tableData[index]);
          }
        });
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //      当前的页数
    handleCurrentChange(val) {}
  }
};
</script>

<style lang="less">
@import "../../css/online/machineplusOnline.less";
</style>
