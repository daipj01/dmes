<template>
  <div class="systemConfiguration">
    <el-container>
      <el-header>
        {{$t('message.portconfiguration')}}
      </el-header>
      <el-main>
        <el-form ref="form" :model="form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('message.port')" prop="port" :rules=rule.port>
                <el-select prop="port" v-model="form.port" :placeholder="$t('message.portdes')" >
                  <el-option label="COM1" value="COM1"></el-option>
                  <el-option label="COM2" value="COM2"></el-option>
                  <el-option label="COM3" value="COM3"></el-option>
                  <el-option label="COM4" value="COM4"></el-option>
                  <el-option label="COM5" value="COM5"></el-option>
                  <el-option label="COM6" value="COM6"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('message.baudRate')" prop="baudRate" :rules=rule.baudRate>
                <el-select v-model="form.baudRate" :placeholder="$t('message.baudRatedes')">
                  <el-option label="300" value="300"></el-option>
                  <el-option label="600" value="600"></el-option>
                  <el-option label="1200" value="1200"></el-option>
                  <el-option label="2400" value="2400"></el-option>
                  <el-option label="4800" value="4800"></el-option>
                  <el-option label="9600" value="9600"></el-option>
                  <el-option label="19200" value="19200"></el-option>
                  <el-option label="38400" value="38400"></el-option>
                  <el-option label="43000" value="43000"></el-option>
                  <el-option label="56000" value="56000"></el-option>
                  <el-option label="57600" value="57600"></el-option>
                  <el-option label="115200" value="115200"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('message.dataBit')" prop="dataBit" :rules=rule.dataBit>
                <el-input v-model="form.dataBit" :placeholder="$t('message.dataBitdes')">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('message.checkBit')" prop="checkBit" :rules=rule.checkBit>
                <el-select v-model="form.checkBit" :placeholder="$t('message.checkBitdes')">
                  <el-option label="None" value=""></el-option>
                  <el-option label="1" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('message.stopBit')" prop="stopBit" :rules=rule.stopBit>
                <el-select v-model="form.stopBit" :placeholder="$t('message.stopBitdes')">
                  <el-option label="1" value="1"></el-option>
                  <el-option label="2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('message.iseffective')" prop="enable" :rules=rule.enable>
                <el-select v-model="form.enable" :placeholder="$t('message.iseffectivedes')">
                  <el-option :label="$t('message.yes')" value="1"></el-option>
                  <el-option :label="$t('message.no')" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">{{$t('message.save')}}</el-button>
            <el-button>{{$t('message.cancle')}}</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script type="text/babel">
  import util from '../../utils/util.js';
  import httpserver from '../../utils/http.js';
  import api from '../../utils/api.js';
  // import config from '../../js/config'
  export default {
    data() {
      return {
        form: {
          port: '',
          baudRate: '',
          dataBit: '',
          checkBit: '',
          stopBit: '',
          enable: '',
          terminalCode: JSON.parse(window.localStorage.getItem('terminal')).terminalCode
        },
        rule: {
          port: [
            {required: true, message: '请选择端口号', trigger: 'change'}
          ],
          baudRate: [
            {required: true, message: '请选择波特率', trigger: 'change'}
          ],
          dataBit: [
            {required: true, message: '请输入数据位', trigger: 'blur'}
          ],
//          checkBit:[
//            {required: true, message: '请选择校验位', trigger: 'change'}
//          ],
          stopBit: [
            {required: true, message: '请选择停止位', trigger: 'change'}
          ],
          enable: [
            {required: true, message: '请选择是否生效', trigger: 'change'}
          ]
        }

      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            httpserver(api.saveSystemCom, this.form)
              .then((response) => {
                if (response.data.returnCode == "0") {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  window.localStorage.setItem('serialPort', JSON.stringify(this.form));
                  let loc = JSON.parse(window.localStorage.getItem('terminal'));
                  if (loc.homePage == null || loc.homePage == undefined || loc.homePage == "") {
                    this.$message({
                      message: '请联系管理员配置首页！',
                      type: 'warning'
                    })
                    this.$router.push('/home');
                  } else {

                    this.$router.push(loc.homePage);
                  }
                }
              })
              .catch((error) => {
                console.log(error.response);
                this.$message({
                  message: error.response.data.errorMessage,
                  type: 'error'
                })
              })
          }
        })
      }
    }
  }
</script>
<style lang="less">
  @import "../../css/system/systemConfiguration.less";
</style>
