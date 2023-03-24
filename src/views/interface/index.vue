<template>
  <div class="interface-page">
    <custom-header>
      <!-- <span slot="title">
        <el-input
          v-model="projectName"
          class="header_title"
          size="small"
          placeholder="未命名站点"
          disabled
        />
      </span> -->
      <div slot="opertBtn">
        <span class="el-button-opert-text">
          <el-button
            type="text"
            size="medium"
            icon="el-icon-upload2"
            @click="uploadComment"
            >组件上传
          </el-button>
          <el-button
            type="text"
            size="medium"
            icon="el-icon-tickets"
            @click="onSaveData()"
            >保 存</el-button
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="deleComment"
            >删除
          </el-button>
        </span>
      </div>
    </custom-header>
    <div class="app-container">
      <div class="interface-page-content">
        <div class="content-top">
          <el-input
            v-model="interfaceConfig.url"
            size="small"
            placeholder="请求地址"
            style="width: 780px"
          >
            <el-select
              slot="prepend"
              v-model="interfaceConfig.method"
              placeholder="请选择"
              style="width: 100px"
            >
              <el-option
                v-for="item in apiMethodList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              slot="prepend"
              v-model="interfaceConfig.connectId"
              placeholder="选择系统"
              style="width: 100px"
              clearable
            >
              <el-option
                v-for="item in connectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-input>
          <el-button
            size="small"
            type="primary"
            style="margin-left: 15px"
            @click="onTestInterface"
            >测 试</el-button
          >
        </div>
        <!-- test -->
        <el-tabs v-model="tabActive" @tab-click="handleClick">
          <el-tab-pane label="Params" name="params">
            <div class="key-value-map">
              <p
                style="
                  font-weight: bold;
                  border-bottom: 1px solid #ccc;
                  padding-left: 10px;
                  padding-bottom: 5px;
                "
                class="border-r"
              >
                Key
              </p>
              <p
                style="
                  font-weight: bold;
                  border-bottom: 1px solid #ccc;
                  padding-left: 10px;
                  padding-bottom: 5px;
                "
              >
                默认值
              </p>
              <div
                v-for="(item, key) in paramsDataList"
                :key="key"
                class="key-value-item"
              >
                <p class="border-r">
                  <input
                    v-model="item.key"
                    type="text"
                    @input="handleParamsAdd(paramsDataList, key)"
                  />
                  <!-- <el-input size="mini" v-model="item.key" @input="handleParamsAdd(paramsDataList, key)"></el-input> -->
                </p>
                <p>
                  <input v-model="item.value" type="text" />
                  <!-- <el-input size="mini" v-model="item.value"></el-input> -->
                </p>
                <i
                  class="el-icon-close"
                  @click="handleParamsRemove(paramsDataList, key)"
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Headers" name="headers">
            <div class="key-value-map">
              <p
                style="
                  font-weight: bold;
                  border-bottom: 1px solid #ccc;
                  padding-left: 10px;
                  padding-bottom: 5px;
                "
                class="border-r"
              >
                Key
              </p>
              <p
                style="
                  font-weight: bold;
                  border-bottom: 1px solid #ccc;
                  padding-left: 10px;
                  padding-bottom: 5px;
                "
              >
                默认值
              </p>
              <div
                v-for="(item, key) in headerDataList"
                :key="key"
                class="key-value-item"
              >
                <p class="border-r">
                  <input
                    v-model="item.key"
                    type="text"
                    @input="handleParamsAdd(headerDataList, key)"
                  />
                  <!-- <el-input size="mini" v-model="item.key" @input="handleParamsAdd(headerDataList, key)"></el-input> -->
                </p>
                <p>
                  <input v-model="item.value" type="text" />
                </p>
                <i
                  class="el-icon-close"
                  @click="handleParamsRemove(headerDataList, key)"
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="Body"
            name="body"
            :disabled="interfaceConfig.method === 'GET'"
          >
            <div class="body-type">
              <el-radio-group v-model="interfaceContentType">
                <el-radio label="multipart/form-data">form-data</el-radio>
                <el-radio label="application/x-www-form-urlencoded"
                  >x-www-form-urlencoded</el-radio
                >
                <el-radio label="application/json">json</el-radio>
              </el-radio-group>
            </div>
            <div class="key-value-map">
              <p
                style="
                  font-weight: bold;
                  border-bottom: 1px solid #ccc;
                  padding-left: 10px;
                  padding-bottom: 5px;
                "
                class="border-r"
              >
                Key
              </p>
              <p
                style="
                  font-weight: bold;
                  border-bottom: 1px solid #ccc;
                  padding-left: 10px;
                  padding-bottom: 5px;
                "
              >
                默认值
              </p>
              <div
                v-for="(item, key) in bodyDataList"
                :key="key"
                class="key-value-item"
              >
                <p class="border-r">
                  <input
                    v-model="item.key"
                    type="text"
                    @input="handleParamsAdd(bodyDataList, key)"
                  />
                  <!-- <el-input size="mini" v-model="item.key" @input="handleParamsAdd(bodyDataList, key)"></el-input> -->
                </p>
                <p>
                  <input v-model="item.value" type="text" />
                </p>
                <i
                  class="el-icon-close"
                  @click="handleParamsRemove(bodyDataList, key)"
                />
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="签名" name="sign">
            <div>
              签名规则：
              <el-select
                size="small"
                v-model="signRule"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option
                  v-for="item in apiMethodList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-button size="small" type="text" icon="el-icon-info"
                >查看</el-button
              >
            </div>
            <div>
              <span style="visibility: hidden">占位符占：</span>
              <el-button size="small" type="text" @click="addSignRule"
                >+ 新建签名规则</el-button
              >
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
    <!-- pop -->
    <signRuleDialog
      :dialog-visible.sync="signRuleDialogVisible"
      title="添加签名"
    />
    <dataParseDialog
      :dialog-visible.sync="dataParseDialogVisible"
      :interface-parse-data="interfaceParseData"
      :interface-data-list="interfaceDataList"
      title="数据解析"
      @onGetParseData="onGetParseData"
    />
    <!-- 组件上传 -->
    <uploadCommentDialog
      ref="uploadCommentForm"
      :dialog-visible.sync="uploadCommentVisible"
      :title="uploadCommentTitle"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import customHeader from "@/components/customHeader/index";
import uploadCommentDialog from "../report/modules/uploadComment/index.vue";
import signRuleDialog from "./sign-rule.vue";
import dataParseDialog from "./data-parse.vue";
import {
  testInterfaceService,
  saveProcessV4Service,
  getProcessDetailV4Service,
} from "@/api/process.js";
import { getConnectListService } from "@/api/database.js";
export default {
  components: {
    customHeader,
    signRuleDialog,
    dataParseDialog,
    uploadCommentDialog,
  },
  props: {
    id: {
      type: String | Number,
      default: 0,
    },
    currentFileData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      uploadCommentVisible: false,
      uploadCommentTitle: "组件上传",
      projectName: "",
      processName: "",
      tabActive: "params",
      signRuleDialogVisible: false,
      dataParseDialogVisible: false,
      apiMethodList: [
        {
          value: "GET",
          label: "GET",
        },
        {
          value: "POST",
          label: "POST",
        },
        {
          value: "DELETE",
          label: "DELETE",
        },
        {
          value: "PUT",
          label: "PUT",
        },
      ],
      signRule: "GET",
      interfaceContentType: "application/x-www-form-urlencoded",
      // 接口参数
      paramsDataList: [
        {
          key: "",
          value: "",
        },
      ],
      headerDataList: [
        {
          key: "",
          value: "",
        },
      ],
      bodyDataList: [
        {
          key: "",
          value: "",
        },
      ],
      interfaceConfig: {
        method: "GET",
        url: "",
        params: {},
        headers: {},
        body: {},
      },
      interfaceDataList: {},
      interfaceParseData: [],
      connectList: [],
    };
  },
  computed: {
    // ...mapGetters([
    //   'projectList'
    // ]),
  },
  watch: {
    interfaceContentType(val) {
      this.interfaceConfig.headers["Content-Type"] = val;
      this.headerDataList.forEach((headerItem) => {
        if (headerItem.key === "Content-Type") {
          headerItem.value = val;
        }
      });
    },
  },
  created() {
    this.projectName = this.$route.query.name;
    this.getDetail();
  },
  mounted() {
    this.getConnectList();
  },
  beforeDestroy() {
    this.onSaveData();
  },
  methods: {
    getConnectList() {
      getConnectListService().then((res) => {
        if (res.code == 0) {
          this.connectList = res.dataList;
        }
      });
    },
    onGetParseData(data) {
      this.interfaceParseData = data;
    },
    onTestInterface() {
      if (!this.checkTestParams()) return;
      const params = this.arrayToObject(this.paramsDataList);
      const headers = this.arrayToObject(this.headerDataList);
      // let headers = {"X-AUTH-TOKEN":"djelniBBBNJN5GO26x314gvubjkllMxq","X-MERCHANT-ID":"1","X-PROJECT-ID":"55","X-AUTH-KEY":"18355403288","x-login-username":"yang.zhao"}
      headers["Content-Type"] = this.interfaceContentType;
      const interfaceConfigParams = {
        method: this.interfaceConfig.method,
        url: this.interfaceConfig.url,
        connectId: this.interfaceConfig.connectId,
        params,
        headers,
      };
      if (this.interfaceConfig.method !== "GET") {
        interfaceConfigParams.body = this.arrayToObject(this.bodyDataList);
      }
      testInterfaceService({
        interfaceConfig: JSON.stringify(interfaceConfigParams),
      }).then((res) => {
        const data = res.data;
        if (typeof data !== "object")
          return this.$message.error("数据类型不符");
        this.interfaceDataList = data;
        this.dataParseDialogVisible = true;
      });
    },
    checkTestParams() {
      const url = this.interfaceConfig.url;
      const connectId = this.interfaceConfig.connectId;
      if (!url) {
        this.$message.error("请求地址不能为空");
        return false;
      } else if (!connectId && !/^http:\/\/|https:\/\//.test(url)) {
        this.$message.error("请求地址不正确");
        return false;
      }
      return true;
    },
    arrayToObject(list) {
      if (!list) return false;
      const obj = {};
      list.forEach((item) => {
        if (item.key) {
          obj[item.key] = item.value;
        }
      });
      return obj;
    },
    objectToArray(obj, list) {
      if (!obj || typeof obj !== "object") return false;
      for (const key in obj) {
        list.push({
          key,
          value: obj[key],
        });
      }
      list.push({
        key: "",
        value: "",
      });
      // list.forEach(item => {
      //   if (item.key && item.value) {
      //     obj[item.key] = item.value
      //   }
      // })
    },
    // uploadComment组件上传
    uploadComment() {
      this.uploadCommentVisible = true;
      this.uploadCommentTitle = "组件上传";
    },
    // 删除组件
    deleComment() {
      const deleCreatGroupEvent = new CustomEvent("dele-creat-group", {
        detail: { data: this.currentFileData },
      });
      window.dispatchEvent(deleCreatGroupEvent);
    },
    onSaveData() {
      // if (!this.processName) return false
      // console.log(this.paramsDataList, this.headerDataList, this.bodyDataList)
      // let params = this.arrayToObject(this.paramsDataList)
      // let headers = this.arrayToObject(this.headerDataList)
      this.interfaceConfig.params = this.arrayToObject(this.paramsDataList);
      this.interfaceConfig.headers = this.arrayToObject(this.headerDataList);
      this.interfaceConfig.headers["Content-Type"] = this.interfaceContentType;
      this.interfaceConfig.body = this.arrayToObject(this.bodyDataList);
      this.interfaceConfig.response = this.interfaceDataList;
      this.interfaceConfig.result = this.interfaceParseData;
      const params = {
        id: this.id,
        processType: this.processType,
        processName: this.processName,
        interfaceConfig: JSON.stringify(this.interfaceConfig),
      };
      // params.id = this.id
      this.listLoading = true;
      saveProcessV4Service(params)
        .then((res) => {
          this.listLoading = false;
          this.$message.success(res.message || "保存成功");
          // this.$emit('refetchData')
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    getDetail() {
      if (!this.id) return false;
      this.listLoading = true;
      // 组件上传需要reportId
      setStorage("reportId", this.id);
      getProcessDetailV4Service({
        processId: this.id,
      })
        .then((res) => {
          this.listLoading = false;
          const data = res.data || {};
          this.processType = data.processType || "";
          this.processName = data.processName || "";
          // 上传组件存类型
          setStorage("subType", data.processType);
          const interfaceConfig = data.interfaceConfig;
          if (interfaceConfig) {
            this.interfaceConfig = JSON.parse(interfaceConfig);
            // 处理页面回显数据
            const params = this.interfaceConfig.params || {};
            const headers = this.interfaceConfig.headers || {};
            const body = this.interfaceConfig.body || {};
            this.interfaceParseData = this.interfaceConfig.result || [];
            this.paramsDataList.splice(0, this.paramsDataList.length);
            this.headerDataList.splice(0, this.headerDataList.length);
            this.bodyDataList.splice(0, this.bodyDataList.length);
            this.objectToArray(params, this.paramsDataList);
            this.objectToArray(headers, this.headerDataList);
            this.objectToArray(body, this.bodyDataList);
            // 判断content-type
            this.interfaceContentType = headers["Content-Type"];
          }
        })
        .catch(() => {
          // 上传组件失败存类型
          setStorage("subType", "");
        });
    },
    addSignRule() {
      this.signRuleDialogVisible = true;
    },
    handleClick() {},
    handleParamsAdd(dataList, index) {
      if (dataList.length !== index + 1) return false;
      dataList.push({
        key: "",
        value: "",
      });
    },
    handleParamsRemove(dataList, index) {
      if (dataList.length <= 1) return false;
      dataList.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.app-container {
  margin: 20px;
  min-height: 500px;
  background-color: #fff;
}
.interface-page-content {
  margin-top: 20px;
  padding: 20px;
  width: 900px;
  background-color: #fff;
  .content-top {
    margin-bottom: 20px;
  }
  .body-type {
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .key-value-map {
    padding-right: 10px;
    .key-value-item {
      // padding-right: 10px;
      input {
        width: 100%;
        padding-left: 10px;
        border: 0;
        border-bottom: 1px solid #ccc;
      }
      &:hover {
        .el-icon-close {
          visibility: visible;
        }
      }
      .el-icon-close {
        visibility: hidden;
        position: absolute;
        right: 0;
        margin-top: 6px;
        cursor: pointer;
      }
    }
    p {
      display: inline-block;
      width: 50%;
      padding-top: 10px;
    }
    .border-r {
      border-right: 1px solid #ccc;
    }
  }
}
</style>
