<template>
  <div class="hottest">
    <div class="convent">
      <div class="convent-input">
        <span style=" width: 11rem;font-size: 1.4rem;color: rgb(0, 0, 0);font-weight: bold;">产品序列号</span>
        <el-input :autosize="{ minRows: 4, maxRows: 4}" size="80" @keyup.enter.native="show($event)" v-model="code">
        </el-input>
        <el-button type="primary" @click="getOrderInfo()">确定</el-button>
      </div>
    </div>
    <div class="topbox">
      <div id="currentorder" class="right-container">
        <el-row :gutter="20">
                  <el-col :span="8">
                    <label class="label">工单编号</label>
                    <div class="detail">{{proinfo.productionOrderNum}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">物料编号</label>
                    <div class="detail">{{proinfo.materialCode}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">物料描述</label>
                    <div class="detail">{{proinfo.materialText}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <label class="label">产品机型</label>
                    <div class="detail">{{proinfo.productModel}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">顺序号</label>
                    <div class="detail">{{proinfo.orderNo}}</div>
                  </el-col>
                  <el-col :span="8">
                    <label class="label">计划数量</label>
                    <div class="detail">{{proinfo.plannedQty}}</div>
                  </el-col>
                </el-row>
      </div>
    </div>
    <div class="convent">
      <div class="convent-input">
        <span style=" width: 11rem;font-size: 1.4rem;color: rgb(0, 0, 0);font-weight: bold;">物料条码</span>
        <el-input :autosize="{ minRows: 4, maxRows: 4}" size="80" @keyup.enter.native="show2($event)"
                  v-model="materialCode">
        </el-input>
        <el-button type="primary" @click="getMaterialByCode()">确定</el-button>
      </div>
    </div>
    <div class="bottom-form">
      <el-table
        :data="motorData"
        height="200"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="materialCode"
          label="物料编号">
        </el-table-column>
        <el-table-column
          prop="materialText"
          label="物料描述">
        </el-table-column>
        <el-table-column
          prop="siteCode"
          label="物料条码">
        </el-table-column>
        <el-table-column
          prop=""
          label="扫描时间">
        </el-table-column>
      </el-table>
    </div>
    <!--<el-button type="primary"></el-button>-->
    <div class="icon-pad-history" @click="getHistoryInfo()"></div>
    <div class="icon-pad-save" @click="saveHistoryInfo()">保存</div>
    <el-dialog :visible.sync="dialogTableVisible" width="80%">
      <div class="linear-input">
        <span>发动机号</span>
        <el-input v-model="productNo" placeholder="请输入内容" width="300"></el-input>
        <el-button type="primary">确认</el-button>
      </div>
      <div class="bottom-form">
        <el-table
          :data="tableData"
          height="350"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="工单编号">
          </el-table-column>
          <el-table-column
            prop=""
            label="发动机号">
          </el-table-column>
          <el-table-column
            prop=""
            label="机型">
          </el-table-column>
          <el-table-column
            prop=""
            label="产品编号">
          </el-table-column>
          <el-table-column
            prop=""
            label="产品描述">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import httpserver from "../../utils/http.js";
import api from "../../utils/api.js";

export default {
  data() {
    return {
      currentRow: "",
      productionOrderNum: "",
      tableData: [],
      motorData: [],
      gridData: [],
      code: "",
      productNo: "", //发动机号
      productCount: 0,
      dialogTableVisible: false,
      currentRow: null,
      proinfo: {},
      materialCode: ""
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
    show: function(ev) {
      if (ev.keyCode == 13) {
        this.getOrderInfo();
      }
    },
    show2: function(ev) {
      if (ev.keyCode == 13) {
        this.getMaterialByCode();
      }
    },
    //      产品序列号
    getOrderInfo() {
      if (this.code != "") {
        let body = {
          serialNo: this.code
        };
        httpserver(api.getSerialNoInformation, body).then(res => {
          this.proinfo = res.data.data;
          if (this.proinfo == null) {
            this.proinfo = {};
          }
          if (res.data.returnCode == "0") {
            this.tableData.push(this.proinfo);
            console.log(this.tableData);
          }
        });
      } else {
        this.$message({
          message: "产品序列号不能为空",
          type: "error"
        });
      }
    },
    //      物料条码
    getMaterialByCode() {
      console.log(this.materialCode);
      if (this.materialCode !== "") {
        let body = {
          materialCode: this.materialCode
        };
        httpserver(api.getMaterialByCode, body).then(res => {
          var resData = res.data.data;
          console.log(resData);
          if (resData != null) {
            this.motorData.push(resData);
          }
        });
      } else {
        this.$message({
          message: "物料号不能为空",
          type: "error"
        });
      }
    },
    //保存发动机信息及物料信息
    saveHistoryInfo() {
      let motorObj = {};
      let motorArr = [];
      console.log();
      for (var i = 0; i < this.tableData.length; i++) {
        let infoData = this.tableData[i];
        motorObj.addressHex = "";
        motorObj.post = 0;
        motorObj.title = "";
        //          motorObj.qty=0;
        motorObj.materialCode = infoData.materialCode;
        motorObj.motorLabel = "";
        motorObj.qty = this.tableData.length;
        motorObj.workCenterCode = JSON.parse(
          localStorage.getItem("terminal")
        ).workCenterCode;
        motorObj.workStationCode = JSON.parse(
          localStorage.getItem("terminal")
        ).workStationCode;
        motorObj.motorNumber = infoData.serialNo;
        motorArr.push(motorObj);
      }
      let body = {
        list: motorArr
      };
      httpserver(api.completeProductionOrder, body).then(res => {
        this.tableData = [];
      });
    },
    getHistoryInfo() {
      this.dialogTableVisible = true;
      this.dialogTableVisible = true;
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workStationCode: loc.workStationCode,
        pageNo: "1",
        pageSize: "1"
      };
      httpserver(api.getHistoryInfo, body).then(response => {
        console.log(response);
        let resData = response.data.data;
        this.gridData = resData.productionStnRecords;
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
    }
  }
};
</script>
<style lang="less">
@import "../../css/hottest.less";
</style>
