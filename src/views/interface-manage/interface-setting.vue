<template>
  <div class="interface-page-content">
    <div class="content-top" style="width: 70%">
      <el-input
        v-model.trim="interfaceConfig.url"
        class="interface-url-input"
        placeholder="请求地址"
        style="padding-right: 170px"
        @input="changeInput"
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
      </el-input>
      <el-button
        type="primary"
        style="position: absolute; right: 83px"
        @click="onSaveData"
      >
        保 存
      </el-button>
      <el-button
        style="position: absolute; right: 0px"
        @click="onDeleteProcess"
      >
        删 除
      </el-button>
      <div style="display: flex; margin-top: 20px">
        <div>
          接口名称：
          <el-input
            v-model="processName"
            placeholder="接口名称"
            style="width: 300px"
          >
            <!-- <i slot="suffix" class="iconfont iconbianji1" /> -->
          </el-input>
        </div>
        <div v-if="!isSearchProcess" style="margin-left: 20px">
          分组：
          <el-select
            style="width: 300px"
            v-model="parentId"
            placeholder="选择分组"
            @change="changeGroup"
          >
            <el-option
              v-for="item in processGroups"
              :key="item.queryId"
              :label="item.name"
              :value="item.queryId"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <!-- test -->
    <el-tabs
      v-model="tabActive"
      style="text-align: center; min-height: 150px; width: 70%"
    >
      <el-tab-pane label="Params" name="params" style="background-color: white">
        <div class="key-value-map">
          <p
            style="
              font-weight: bold;
              border-bottom: 1px solid #e9eaeb;
              height: 45px;
              line-height: 45px;
            "
            class="border-r"
          >
            KEY
          </p>
          <p
            style="
              font-weight: bold;
              border-bottom: 1px solid #e9eaeb;
              height: 45px;
              line-height: 45px;
            "
          >
            VALUE
          </p>
          <div
            v-for="(item, key) in paramsDataList"
            :key="key"
            class="key-value-item"
          >
            <p class="border-r">
              <input
                v-model="item.key"
                style="background-color: white"
                type="text"
                placeholder="请输入参数名"
                @input="handleParamsAdd(paramsDataList, key)"
              />
            </p>
            <p>
              <input
                v-model="item.value"
                style="background-color: white"
                placeholder="请输入默认值"
                type="text"
              />
            </p>
            <i
              class="el-icon-close"
              @click="handleParamsRemove(paramsDataList, key)"
            />
          </div>
        </div>
        <div
          v-if="pathDataList && pathDataList.length > 0"
          class="key-value-map"
        >
          <div class="interface-path">Path参数</div>
          <p
            style="
              font-weight: bold;
              border: 1px solid #e9eaeb;
              height: 45px;
              line-height: 45px;
            "
            class="border-r"
          >
            KEY
          </p>
          <p
            style="
              font-weight: bold;
              border: 1px solid #e9eaeb;
              height: 45px;
              line-height: 45px;
            "
          >
            VALUE
          </p>
          <div
            v-for="(item, key) in pathDataList"
            :key="key"
            class="key-value-item"
          >
            <p class="border-r">
              <input
                v-model="item.key"
                style="background-color: white"
                type="text"
                placeholder="请输入参数名"
                disabled
              />
            </p>
            <p>
              <input
                v-model="item.value"
                style="background-color: white"
                placeholder="请输入默认值"
                type="text"
              />
            </p>
            <i
              class="el-icon-close"
              @click="handleParamsRemove(paramsDataList, key)"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="Headers"
        name="headers"
        style="background-color: white"
      >
        <div class="key-value-map">
          <p
            style="
              font-weight: bold;
              border-bottom: 1px solid #e9eaeb;
              height: 45px;
              line-height: 45px;
            "
            class="border-r"
          >
            KEY
          </p>
          <p
            style="
              font-weight: bold;
              border-bottom: 1px solid #e9eaeb;
              height: 45px;
              line-height: 45px;
            "
          >
            VALUE
          </p>
          <div
            v-for="(item, key) in headerDataList"
            :key="key"
            class="key-value-item"
          >
            <p class="border-r">
              <input
                v-model="item.key"
                style="background-color: white"
                type="text"
                placeholder="请输入参数名"
                @input="handleParamsAdd(headerDataList, key)"
              />
              <!-- <el-input size="mini" v-model="item.key" @input="handleParamsAdd(headerDataList, key)"></el-input> -->
            </p>
            <p>
              <input
                v-model="item.value"
                style="background-color: white"
                placeholder="请输入默认值"
                type="text"
              />
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
        style="
          background-color: white;
          overflow-y: auto;
          max-height: calc(100vh - 280px);
        "
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
              border-bottom: 1px solid #e9eaeb;
              height: 45px;
              line-height: 45px;
            "
            class="border-r"
          >
            KEY
          </p>
          <p
            style="
              font-weight: bold;
              border-bottom: 1px solid #e9eaeb;
              height: 45px;
              line-height: 45px;
            "
          >
            VALUE
          </p>
          <div
            v-for="(item, key) in bodyDataList"
            :key="key"
            class="key-value-item"
          >
            <p class="border-r">
              <input
                v-model="item.key"
                style="background-color: white"
                type="text"
                placeholder="请输入参数名"
                @input="handleParamsAdd(bodyDataList, key)"
              />
              <!-- <el-input size="mini" v-model="item.key" @input="handleParamsAdd(bodyDataList, key)"></el-input> -->
            </p>
            <p>
              <input
                v-model="item.value"
                style="background-color: white"
                placeholder="请输入默认值"
                type="text"
              />
            </p>
            <i
              class="el-icon-close"
              @click="handleParamsRemove(bodyDataList, key)"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="调用前" name="调用前">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
          "
        >
          <div style="margin-right: 20px">公共脚本</div>
          <el-select
            clearable
            v-model="beforeCommonScriptId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in commonScriptList"
              :key="item.id"
              :label="item.preName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </el-tab-pane>
      <el-tab-pane label="调用后" name="调用后">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
          "
        >
          <div style="margin-right: 20px">公共脚本</div>
          <el-select
            clearable
            v-model="afterCommonScriptId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in commonScriptList"
              :key="item.id"
              :label="item.preName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <div style="display: flex; align-items: center; margin: 10px 0 0 0; width: 70%;">
      <div style="flex: 1; font-size: 18px">返回响应</div>
      <el-button type="primary" @click="onTestInterface"> 测 试 </el-button>
    </div> -->
    <dataParseDialog
      style="padding-top: 20px"
      ref="dataParseView"
      :interface-parse-list="interfaceParseList"
      :interface-data="interfaceData"
      title="数据解析"
      @onGetParseData="onGetParseData"
      @onTestInterface="onTestInterface"
      v-if="!listLoading"
    />
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
import dataParseDialog from "./data-parse.vue";
import {
  getProcessDetailV4Service,
  saveProcessV5Service,
  testInterfaceV5Service,
} from "@/api/process.js";
import {
  deleteConnectPreService,
  getConnectPreListService,
  saveConnectPreService,
} from "@/api/connect-pre";
import {
  delDatabaseV4,
  delProcessV4,
  saveProjectFileTreeListSortService,
} from "@/api/v4";
import { getStorage, setStorage } from "@/util/storageUtil.js";
export default {
  name: "interface-setting",
  components: {
    CodeEditor,
    dataParseDialog,
  },
  props: {
    connectId: {
      type: String | Number,
      default: 0,
    },
    processList: {
      type: Array,
      default: [],
    },
    processGroups: {
      type: Array,
      default: [],
    },
    //是否是从搜索进来的，如果是，隐藏分组信息
    isSearchProcess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listLoading: false,
      id: 0,
      tabActive: "params",
      processName: "",
      processType: "interface",
      parentId: 0,
      interfaceParseList: [],
      beforeCallingList: [],
      commonScriptList: [],
      beforeCommonScriptId: "",
      afterCommonScriptId: "",
      isReloadCodeEditor: true,
      showBeforeCalling: false,
      showAfterCalling: false,
      interfaceData: {},
      interfaceContentType: "application/x-www-form-urlencoded",
      chosenConnectPre: {
        id: 0,
        beforeCalling: "",
        afterCalling: "",
      },
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
      pathDataList:[
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
        path: {},
      },
    };
  },
  watch: {
    connectId(val) {
      this.getConnectPreList();
    },
  },
  mounted() {
    // this.id = this.processId
    this.getDetail();
  },
  methods: {
    changeInput() {
      console.log(this.interfaceConfig.url);
      var temp;
      var pattern = /{(.*?)}/g;
      var conditions = [];
      while ((temp = pattern.exec(this.interfaceConfig.url))) {
        console.log("temp", temp);
        var tItem = temp[1];
        if (conditions.indexOf(tItem) < 0) {
          conditions.push(tItem);
        }
      }
      this.pathDataList = new Array();
      for (var key in conditions) {
        this.pathDataList.push({ key: conditions[key], value: "" });
      }
      console.log(this.pathDataList);
    },
    changeGroup() {
      let tempProcess = "";
      //找出当前元素，在原位置删除
      for (let i = 0; i < this.processList.length; i++) {
        let process = this.processList[i];
        if (process.dataType == "directory") {
          for (let j = 0; j < process.children.length; j++) {
            let pro = process.children[j];
            if (this.id == pro.queryId) {
              tempProcess = pro;
              process.children.splice(j, 1);
              break;
            }
          }
        } else {
          if (this.id == process.queryId) {
            tempProcess = process;
            this.processList.splice(i, 1);
            break;
          }
        }
      }
      //添加到新位置
      //parentId为0表示根目录
      if (this.parentId == 0) {
        this.processList.push(tempProcess);
      } else {
        for (const process of this.processList) {
          if (
            process.dataType == "directory" &&
            process.queryId == this.parentId
          ) {
            process.children.push(tempProcess);
            break;
          }
        }
      }
      saveProjectFileTreeListSortService(this.processList);
    },
    getConnectPreList(type) {
      let param = {
        connectId: this.connectId,
        type: type,
      };
      getConnectPreListService(param).then((res) => {
        this.commonScriptList = res.dataList;
      });
    },
    onDeleteProcess() {
      this.$confirm("确认删除本接口？")
        .then((_) => {
          delProcessV4({
            processId: this.id,
          }).then(() => {
            this.$emit("onDeleteProcess");
            // this.initData()
          });
        })
        .catch((_) => {});
    },
    onAddProcess(parentId) {
      this.parentId = parentId;
      this.id = "";
      this.processName = "";
      this.beforeCommonScriptId = "";
      this.afterCommonScriptId = "";
      this.interfaceConfig = {
        connectId: this.connectId,
        method: "GET",
        url: "",
        params: {},
        headers: {},
        body: {},
      };
      console.log("interfaceConfig=", this.interfaceConfig);
      // 处理页面回显数据
      this.interfaceParseList = this.interfaceConfig.result || [];
      this.paramsDataList = [
        {
          key: "",
          value: "",
        },
      ];
      this.headerDataList = [
        {
          key: "",
          value: "",
        },
      ];
      this.bodyDataList = [
        {
          key: "",
          value: "",
        },
      ];
      this.interfaceContentType = "application/x-www-form-urlencoded";
      this.$nextTick(function () {
        this.$refs.dataParseView.dataParse();
      });
    },
    getDetail(id, parentId) {
      this.interfaceData = {};
      // this.getConnectPreList();
      this.id = id;
      this.parentId = parentId;
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
          console.log("processName=", this.processName);
          // 上传组件存类型
          setStorage("subType", data.processType);
          const interfaceConfig = data.interfaceConfig;
          if (interfaceConfig) {
            this.interfaceConfig = JSON.parse(interfaceConfig);
            // 处理页面回显数据
            const params = this.interfaceConfig.params || {};
            const headers = this.interfaceConfig.headers || {};
            const body = this.interfaceConfig.body || {};
            const path = this.interfaceConfig.path || {};
            this.interfaceParseList = this.interfaceConfig.result || [];
            this.paramsDataList.splice(0, this.paramsDataList.length);
            this.headerDataList.splice(0, this.headerDataList.length);
            this.bodyDataList.splice(0, this.bodyDataList.length);
            this.pathDataList.splice(0, this.pathDataList.length);
            this.objectToArray(params, this.paramsDataList);
            this.objectToArray(headers, this.headerDataList);
            this.objectToArray(body, this.bodyDataList);
            this.objectToArray(path, this.pathDataList);
            // 判断content-type
            this.interfaceContentType = headers["Content-Type"];
            //找到对应的preid
            this.beforeCommonScriptId = data.beforePreId;
            this.afterCommonScriptId = data.afterPreId;

            this.onTestInterface(); // 获取接口数据后，执行该接口，获取接口返回数据
            this.$nextTick(function () {
              this.$refs.dataParseView.dataParse();
            });
          }
        })
        .catch(() => {
          // 上传组件失败存类型
          setStorage("subType", "");
          this.listLoading = false;
        });
    },
    onTestInterface() {
      if (!this.checkTestParams()) return;
      const params = this.arrayToObject(this.paramsDataList);
      const headers = this.arrayToObject(this.headerDataList);
      const path = this.arrayToObject(this.pathDataList);
      // let headers = {"X-AUTH-TOKEN":"djelniBBBNJN5GO26x314gvubjkllMxq","X-MERCHANT-ID":"1","X-PROJECT-ID":"55","X-AUTH-KEY":"18355403288","x-login-username":"yang.zhao"}
      headers["Content-Type"] = this.interfaceContentType;
      const interfaceConfigParams = {
        method: this.interfaceConfig.method,
        url: this.interfaceConfig.url,
        connectId: this.interfaceConfig.connectId,
        params,
        headers,
        path
      };
      if (this.interfaceConfig.method !== "GET") {
        interfaceConfigParams.body = this.arrayToObject(this.bodyDataList);
      }
      let param = {
        interfaceConfig: JSON.stringify(interfaceConfigParams),
      };
      if (this.beforeCommonScriptId) {
        param.beforePreId = this.beforeCommonScriptId;
      }
      if (this.afterCommonScriptId) {
        param.afterPreId = this.afterCommonScriptId;
      }
      testInterfaceV5Service(param).then((res) => {
        const data = res.data;
        if (typeof data !== "object")
          return this.$message.error("数据类型不符");
        this.interfaceData = data;
        this.dataParseDialogVisible = true;
        this.$nextTick(function () {
          this.$refs.dataParseView.dataParse();
        });
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
    onGetParseData(data) {
      this.interfaceParseList = data;
    },
    onSaveData() {
      if (!this.processName) {
        this.$message.error("接口名称不能为空");
        return false;
      }
      this.interfaceConfig.params = this.arrayToObject(this.paramsDataList);
      this.interfaceConfig.headers = this.arrayToObject(this.headerDataList);
      this.interfaceConfig.headers["Content-Type"] = this.interfaceContentType;
      this.interfaceConfig.body = this.arrayToObject(this.bodyDataList);
      this.interfaceConfig.path = this.arrayToObject(this.pathDataList);
      this.interfaceConfig.response = {};
      this.interfaceConfig.result = this.interfaceParseList;
      const params = {
        // id: this.id,
        processType: this.processType,
        processName: this.processName,
        interfaceConfig: JSON.stringify(this.interfaceConfig),
      };
      if (this.id) params.id = this.id;
      if (this.parentId && this.parentId !== 0) params.parentId = this.parentId;
      // this.listLoading = true;
      if (this.beforeCommonScriptId) {
        params.beforePreId = this.beforeCommonScriptId;
      }
      if (this.afterCommonScriptId) {
        params.afterPreId = this.afterCommonScriptId;
      }
      console.log("save params = ", params);
      console.log("save interface = ", this.interfaceConfig);
      saveProcessV5Service(params)
        .then((res) => {
          // this.listLoading = false;
          this.id = res.data.dataProcessId;
          this.$message.success(res.message || "保存成功");
          this.$emit("initData");
          // this.onSelectedConnect(this.selectedConnectId);
        })
        .catch(() => {
          // this.listLoading = false;
        });
    },
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
    deleteConnectPre(id) {
      this.$confirm("确认删除本条数据？")
        .then((_) => {
          let param = {
            businessConnectId: id,
          };
          deleteConnectPreService(param).then((res) => {
            this.$message.success("删除成功");
            this.getConnectPreList();
          });
        })
        .catch((_) => {});
    },
    saveConnectPre(preName) {
      this.chosenConnectPre.preName = preName;
      if (!this.chosenConnectPre.id) {
        delete this.chosenConnectPre.id;
      }
      this.chosenConnectPre.connectId = this.selectedConnectId;
      saveConnectPreService(this.chosenConnectPre).then((res) => {
        this.$message.success("保存成功");
        this.getConnectPreList();
      });
    },
    cleanCalling() {
      this.isReloadCodeEditor = false;
      this.chosenConnectPre = {
        beforeCalling:
          "def prepost(String url, String method, Map<String, String> headers, Map<String, String> params) {" +
          "\n\n" +
          "}",
        afterCalling:
          "def afterpost(Map<String, Object> response) {" + "\n\n" + "}",
      };
      let that = this;
      delete this.chosenConnectPre.id;
      setTimeout(() => {
        that.isReloadCodeEditor = true;
      }, 0);
    },
    chooseConnectPre(item) {
      this.isReloadCodeEditor = false;
      this.chosenConnectPre = item;
      let that = this;
      setTimeout(() => {
        that.isReloadCodeEditor = true;
        that.$forceUpdate();
      }, 0);

      console.log("chooseConnectPre", this.chosenConnectPre);
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
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.overlow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.interface-page {
  height: 94%;
}
.tree-item-text-wrap {
  width: 100%;
  .tree-text-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    display: inline-block;
    width: 90%;
    vertical-align: middle;
  }
  .rename-input {
    border: 0;
    border-bottom: 1px solid;
    width: 95%;
  }
  .el-icon-more {
    visibility: hidden;
    position: absolute;
    right: 2px;
    margin-top: 7px;
  }
  &:hover {
    .el-icon-more {
      visibility: inherit;
    }
  }
  .el-icon-more:hover {
    color: #409eff;
  }
}
.app-container {
  display: flex;
  // margin: 20px;
  // min-height: 500px;
  height: calc(100vh - 100px);
  background-color: #f5f5f5;
  border-radius: 0;
}
.system-list-wrap {
  float: left;
  font-size: 18px;
  width: 240px;
  padding: 10px;
  background-color: white;
  border-right: 1px solid #e4e5e6;
  overflow-y: auto;
  height: 100%;
}
.interface-list-wrap {
  // margin-left: 20px;
  .interface-search {
    /deep/.el-input__inner {
      background-color: #f4f5f6;
    }
  }
}
.interface-page-content {
  flex: 1;
  // margin-top: 20px;
  padding: 20px;
  // width: 900px;
  background-color: #fff;
  .interface-url-input {
    /deep/.el-input__inner {
      // background-color: #f5f7fa;
    }
  }
  .content-top {
    position: relative;
    margin-bottom: 20px;
  }
  .body-type {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .key-value-map {
    // padding-right: 10px;
    border: 1px solid #e9eaeb;
    .key-value-item {
      // padding-right: 10px;
      input {
        width: 100%;
        height: 45px;
        padding-left: 10px;
        border: 0;
        border-bottom: 1px solid #e9eaeb;
      }
      &:hover {
        .el-icon-close {
          visibility: visible;
        }
      }
      .el-icon-close {
        visibility: hidden;
        position: absolute;
        right: 6px;
        margin-top: 16px;
        cursor: pointer;
      }
    }
    p {
      display: inline-block;
      width: 50%;
      // padding-top: 10px;
    }
    .border-r {
      border-right: 1px solid #e9eaeb;
    }
  }
}
.list-title {
  height: 70px;
  padding-top: 20px;
  padding-left: 20px;
  border-bottom: 1px solid #e4e5e6;
}
.pre-div {
  padding: 0 20px;
}
.calling {
  display: flex;
  padding-top: 10px;
}
.calling-item {
  width: 100%;
  text-align: left;
  padding-left: 10px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  &.active {
    background-color: #edeeef;
  }
}

.calling-delete {
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.interface-path {
  text-align: left;
  margin-top: 16px;
  margin-bottom: 8px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
}
</style>
