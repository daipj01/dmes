<template>
  <div class="macheineWorkInsert">
    <div class="convent">
      <div class="convent-input">
        <span style="width: 11rem;font-size: 1.4rem;color: rgb(0, 0, 0);font-weight: bold;">{{$t('message.productSerial')}}</span>
        <el-input  :autosize="{ minRows: 4, maxRows: 4}" size="80" @keyup.enter.native="show($event)" v-model="code">
        </el-input>
        <el-button type="primary" @click="getOrderInfo()">{{$t('message.fix')}}</el-button>
      </div>
    </div>
    <div class="bottom-form" style="margin-top: 1rem;">
      <div id="subOutputRank-print">
        <el-table
          :data="tableData"
          border
          style="width: 100%;font-size: 1.2rem;max-height: 500px">
          <!-- <el-table-column
            label="序号"
            type="index"
            width="100">
          </el-table-column> -->
          <el-table-column
            prop="productionOrderNum"
            :label="$t('message.productionOrderNum')" 
            width="250">
          </el-table-column>
          <el-table-column
            width="150"
            :label="$t('message.materialCode')"
           >
          </el-table-column>
          <el-table-column
            prop="serialNo"
            width="280"
           :label="$t('message.productSerial')">
          </el-table-column>
          <el-table-column
            prop=""
            :label="$t('message.quantity')">
          </el-table-column>
          <el-table-column
            prop=""
            :label="$t('message.remarks')">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!---->
    <div class="history-info">
      <el-dialog  :visible.sync="dialogTableVisible" width="80%">
        <el-table :data="gridData" style="width: 100%">
          <el-table-column prop="materialCode" :label="$t('message.materialCode')">
          </el-table-column>
          <el-table-column prop="materialText" :label="$t('message.materialText')">
          </el-table-column>
          <el-table-column prop="quanlity" :label="$t('message.productSerial')">
          </el-table-column>
          <el-table-column prop="orderNo" :label="$t('message.offlinetime')">
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

    <!--托条码打印弹出窗口-->
    <el-dialog  :visible.sync="dialogVisible" width="80%" :title="$t('message.printbarcode')">
      <div class="linear-input">
        <span>{{$t('message.barcode')}}</span>
        <el-input v-model="pallinfo" width="300"></el-input>
        <el-button type="primary" @click="collectPall()">{{$t('message.fix')}}</el-button>
      </div>
      <el-table :data="palletizedData">
        <el-table-column
          type="selection"
          width="42">
        </el-table-column>
        <el-table-column  prop="palletBarCode" :label="$t('message.barcode')" width="100">
        </el-table-column>
        <el-table-column prop="materialCode" :label="$t('message.materialCode')">
        </el-table-column>
        <el-table-column prop="materialText" :label="$t('message.materialText')">
        </el-table-column>
        <el-table-column prop="roundtripTime" :label="$t('message.fittedtime')">
        </el-table-column>
      </el-table>
      <!--<el-button type="primary">主要按钮</el-button>-->
      <!--<button class="print" @click="replenishPrint()">补打印</button>-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-dialog>


    <div class="icon-pad-history" @click="getHistoryInfo()"></div>
    <div class="icon-pad-save" @click="replenishPrint()">{{$t('message.printup')}}</div>
    <!--<div class="fixed-box">-->
      <!--<span @click="getHistoryInfo()">历史记录</span>-->
      <!--<span @click="replenishPrint()">补打印</span>-->
    <!--</div>-->
  </div>
</template>

<script type="text/babel">
import httpserver from "../../utils/http.js";
import api from "../../utils/api.js";
export default {
  data() {
    return {
      tableData: [],
      code: "",
      input: "",
      palletizedData: [],
      sequenceCount: 0,
      dialogTableVisible: false,
      dialogVisible: false,
      isHistory: false,
      isPrint: false,
      gridData: [],
      pallinfo: "",
      total: 0,
      serialPort: "" //扫描器端口
    };
  },
  beforeRouteLeave(to, from, next) {
    this.closeCom();
    next();
  },
  created() {},
  mounted() {
    this.openCom();
  },
  methods: {
    getHistoryInfo() {
      this.isHistory = true;
      //防止两个弹框冲突
      if (this.isHistory == true) {
        this.dialogTableVisible = true;
      }
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
    // 根据序列号查询
    getOrderInfo() {
      if(this.code!=''){
        let body = {
          serialNo: this.code
        };

        httpserver(api.getSerialNoInformation, body).then(res => {
          //6947463266069
          //6944437047143
          let resData = res.data.data;
          let productOrderNums = "";
          if (res.data.returnCode == "0") {

            console.log(this.sequenceCount);
            //打印条件 数量达到||这个订单号和上一个不一样了，打印
            let palletCount = res.data.data.trayNumber;
            if (this.sequenceCount == palletCount) {
              this.printContent();
              this.tableData = [];
            }
            this.tableData.push(res.data.data);
            productOrderNums = localStorage.getItem("productOrderNums");
            //订单进入到下一个打印前一个订单
            if (
              res.data.data.productOrderNum != productOrderNums &&
              productOrderNums !== null
            ) {
              this.printContent();
              localStorage.removeItem("productOrderNums");
            }
            localStorage.setItem(
              "productOrderNums",
              res.data.data.productOrderNum
            );
            localStorage.setItem("sequenceCount", this.sequenceCount);
            this.sequenceCount = localStorage.getItem("sequenceCount");
            this.sequenceCount++;
          }
        });
      }else{
        this.$message({
          message: "产品序列号不能为空",
          type: "error"
        });
      }

    },

    //      补打印
    replenishPrint() {
      this.dialogVisible = true;
      //        查询托条码
      let body = {
        palletBarCode: "evn1",
        pageNo: 1,
        pageSize: 3
      };
      httpserver(api.getPalletizedRecords, body).then(response => {
        var resData = response.data.data;
        this.palletizedData = resData.palletizedRecords;
        this.total = resData.toalCount;
      });
    },
    //查询物料
    collectPall() {
      //        palletBarCode = this.pallinfo;
      let body = {
        palletBarCode: this.pallinfo,
        pageNo: 1,
        pageSize: 3
      };
      httpserver(api.getPalletizedRecords, body).then(response => {
        var resData = response.data.data;
        this.palletizedData = resData.palletizedRecords;
        this.total = resData.toalCount;
      });
    },
    // 调用打印机接口
    printContent(e) {
      let subOutputRankPrint = document.getElementById("subOutputRank-print");
      console.log(subOutputRankPrint.innerHTML);
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
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
    //      键盘事件
    show: function(ev) {
      let _this = this;
      if (ev.keyCode == 13) {
       this.getOrderInfo();
      }
    },
    //      分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="less">
@import "../../css/machineWorkInsert/machineWorkInsert.less";
</style>
