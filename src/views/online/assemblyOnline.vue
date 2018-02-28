<template>
  <div class="assemblyOnline">
    <el-container>
      <el-aside width="60%">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">{{$t('message.productionOrderNum')}}</label>
                    <div class="detail">{{tableData.productionOrderNum}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">{{$t('message.productModel')}}</label>
                    <div class="detail">{{tableData.productModel}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">{{$t('message.materialCode')}}</label>
                    <div class="detail">{{tableData.materialCode}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">{{$t('message.productOrderNum')}}</label>
                    <div class="detail">{{tableData.productOrderNum}}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <label class="label">{{$t('message.plannedQuantity')}}</label>
                    <div class="detail">{{tableData.plannedQuantity}}</div>
                  </el-col>
                  <el-col :span="12">
                    <label class="label">{{$t('message.orderNo')}}</label>
                    <div class="detail">{{tableData.orderNo}}</div>
                  </el-col>
                </el-row>
      </el-aside>
      <el-main>
        <div class="img-container no-info engine"></div>
      </el-main>

    </el-container>
    <div class="bottom">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="productOrderNum" :label="$t('message.productOrderNum')" width="240">
        </el-table-column>
        <el-table-column prop="productionOrderNum" :label="$t('message.productionOrderNum')" width="230">
        </el-table-column>
        <!--<el-table-column prop="productModel" label="机型" width="100" >-->
        <!--</el-table-column>-->
        <el-table-column prop="materialCode" :label="$t('message.materialCode')" width="140">
        </el-table-column>
        <!--<el-table-column prop="materialText" label="物料描述" width="200">-->
        <!--</el-table-column>-->
        <el-table-column prop="orderNo" :label="$t('message.orderNo')" width="260">
        </el-table-column>
        <el-table-column prop="plannedQty" :label="$t('message.plannedQuantity')" width="152">
        </el-table-column>
      </el-table>
    </div>
    <div class="icon-pad-history" @click="getHistoryInfo()">
    </div>
    <!--历史记录-->
    <div class="history-info">
      <el-dialog :visible.sync="dialogTableVisible" width="80%">
        <el-table :data="gridData">
          <el-table-column prop="productOrderNum" :label="$t('message.productOrderNum')">
          </el-table-column>
          <el-table-column prop="productionOrderNum" :label="$t('message.productionOrderNum')">
          </el-table-column>
          <el-table-column prop="materialCode" :label="$t('message.materialCode')">
          </el-table-column>
          <!-- <el-table-column prop="materialText" label="物料描述">
          </el-table-column> -->
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

  </div>
</template>

<script>
// import currentorder from './component/currentOrder.vue';
import httpserver from "../../utils/http.js";
import api from "../../utils/api.js";

export default {
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      gridData: [],
      pageNo: "",
      total: 0
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData: function() {
      let loc = JSON.parse(window.localStorage.getItem("terminal"));
      let body = {
        workCenterCode: loc.workCenterCode,
        statuseCode: "10",
        endRow: 3
      };
      httpserver(api.getAssemblyData, body).then(response => {
        this.tableData = response.data.data;
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
        this.total = resData.toalCount;
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
        let resData = response.data.data;
        this.gridData = resData.productionStnRecords;
        this.total = resData.toalCount;
      });
    }
  }
};
</script>


<style lang="less">
@import "../../css/online/assemblyOnline.less";
</style>
