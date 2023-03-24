<template>
  <div style="padding-left: 20px">
    <div style="padding: 10px 0 0">{{ title }}</div>
    <!------------------- 组件隐藏 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-display'"
    >
      <el-select
        multiple
        filterable
        v-model="singleActionItem.operateDisplay"
        placeholder="请选择"
        :key="11"
      >
        <el-option
          v-for="(item, key) in linearComponentList"
          :key="key"
          :label="item.options.commonConfigAssignName"
          :value="item.uuid"
        >
        </el-option>
      </el-select>
    </div>
    <!------------------- 逻辑判断配置 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'status-operate-if'"
    >
      <valueSelect
        :paramItem="singleActionItem"
        :isBind="true"
        @handleChange="handleChange"
        style="padding: 10px 0px"
      />
      <!-- 判断 -->
      <el-input
        size="small"
        placeholder="请输入内容"
        v-model="singleActionItem.logicValue"
        style="width: 215px; padding-bottom: 10px"
      >
        <el-select
          placeholder=" "
          v-model="singleActionItem.logicOperator"
          slot="prepend"
          style="width: 100px"
        >
          <el-option
            v-for="(value, key) in {
              '=': '=',
              '>': '>',
              '>=': '>=',
              '<': '<',
              '<=': '<=',
              '!=': '!=',
              isNull: 'isNull',
              isNotNull: 'isNotNull',
            }"
            :key="key"
            :label="value"
            :value="key"
          ></el-option>
        </el-select>
      </el-input>
      <!-- 判断之后的处理：： 因为在面板模式下不支持条件判断，只能文本显示 -->
      <!-- <div>
        {{ actionItem.logicChildren }}
      </div> -->
    </div>
    <!-------------------------- 组件设值  ------------------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-set'"
    >
      <eventActionSet
        :actionSet="singleActionItem.actionSet"
        @saveActionSet="saveActionSet"
      ></eventActionSet>
    </div>
    <!-------------------------- 组件设值 状态渲染器  ------------------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'status-operate-set'"
    >
      <StatusOperateSetValue
        :tableColumnConfig="tableColumnConfig"
        :singleActionItem="singleActionItem"
        @saveActionSet="saveActionSet"
      ></StatusOperateSetValue>
    </div>
    <!-------------------------- 操作渲染 状态渲染器  ------------------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'status-operate-operate'"
    >
      <StatusOperateSetText
        :currentOperateItem="currentOperateItem"
        :tableColumnConfig="tableColumnConfig"
        :singleActionItem="singleActionItem"
        @saveActionSet="saveActionSet"
      ></StatusOperateSetText>
    </div>
    <!------------------- 组件颜色 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'status-operate-color'"
    >
      <div
        class="colorSetting"
        @click.stop="showColorPicker = true"
        @mouseleave="showColorPicker = false"
      >
        <span>
          <i
            class="iconfont iconzitiyanse iconStyles"
            :style="{ color: singleActionItem.textColor }"
          />
          <colorPicker
            :key="2"
            v-model="singleActionItem.textColor"
            style="visibility: hidden"
            @change="showColorPicker = false"
            :openStatus="showColorPicker"
          />
        </span>
        <span>请选择字体颜色</span>
      </div>
      <div
        class="colorSetting"
        @click.stop="showBGColorPicker = true"
        @mouseleave="showBGColorPicker = false"
      >
        <span class="colorStyle">
          <i
            class="iconfont iconzitiyanse iconStyle"
            :style="{
              color: singleActionItem.textColor,
              background: singleActionItem.textBgColor,
            }"
          />
          <colorPicker
            :key="1"
            v-model="singleActionItem.textBgColor"
            style="visibility: hidden"
            @change="showBGColorPicker = false"
            :openStatus="showBGColorPicker"
          />
        </span>
        <span>请选择背景颜色</span>
      </div>
    </div>
    <!----------------------- 函数脚本 --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-function'"
    >
      <actionFunction
        :actionItem="singleActionItem"
      ></actionFunction>
    </div>
  </div>
</template>

<script>
/**
 * 事件行为配置
 */

import {
  getProcessApiParamsService,
  getProcesseDataList,
  getReportInterfaceList,
  getReportDetail,
} from "@/api/chartsData";

import { getProcessParamService } from "@/api/process";

import { getListAllV4 } from "@/api/report";
import eventActionView from "@/views/report/layout/report-config-event/action-modules/event-item.vue"; // TODO::: 引入自身组件，循环引入
import actionHrefView from "@/views/report/layout/report-config-event/action-modules/action-href.vue";
import actionDialogBoxView from "@/views/report/layout/report-config-event/action-modules/action-dialog-box.vue";

import StatusOperateSetValue from './components/status-operate-set-value.vue'
import StatusOperateSetText from './components/status-operate-set-text.vue'
import eventActionSet from "@/views/report/layout/report-config-event/action-modules/event-action-set.vue";
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
import actionFunction from "@/views/report/layout/report-config-event/action-modules/action-function.vue";
export default {
  name: "eventActionView",
  components: {
    eventActionView,
    actionHrefView,
    actionDialogBoxView,
    eventActionSet,
    valueSelect,
    actionFunction,
    StatusOperateSetValue,
    StatusOperateSetText
  },
  props: {
    currentOperateItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableColumnConfig: {
      type: Object,
      default: () => []
    },
    actionItem: {
      type: Object,
      default: () => {},
    },
    refreshComponentList: {
      type: Array,
      default: () => [],
    },
    dialogBoxComponentList: {
      type: Array,
      default: () => [],
    },
    linearComponentList: {
      type: Array,
      default: () => [],
    },

    subpageList: {
      type: Array,
      default: () => [],
    },
    deviceDesignType: {
      type: String,
      default: "MOBILE",
    },
    interfaceApiAll: {
      type: Array,
      default: () => [],
    },
    hrefPageList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      radio: "",
      radio1: "",
      title: "",
      singleActionItem: {},
      varDataObj: {},
      interfaceKeyList: {},
      // hrefPageList: [],
      paramsActiveNames: "",
      statusActiveNames: "",
      // interfaceApiAll: [],
      processApiParamsList: [], // 接口参数列表
      showColorPicker: false,
      showBGColorPicker: false,
      styleEditorConfig: {},
    };
  },
  watch: {
    actionItem(val) {
      this.singleActionItem = val; //新增result的watch，监听变更并同步到myResult上
    },
  },
  created() {
    // console.log(lastDay(2));
    this.varDataObj = this.$pageDataModelEngine.getCustomData();
    // // TODO 每次打开流程或者拖动一个新的组件都会调用一次，找时间优化了 ，可以放到vuex 里面去取
    // this.queryInterfaceDataList();
    // this.queryReportList();
  },
  mounted() {
    console.log("****interfaceApiAll***", JSON.stringify(this.interfaceApiAll));
  },
  methods: {
    init(diagram) {
      console.log("right menu init", diagram);
      this.singleActionItem = diagram.properties;
      this.title = diagram.title;
      console.log("----------------init", this.varDataObj);
      // this.varDataObj = this.$pageDataModelEngine.getCustomData();
      // // TODO 每次打开流程或者拖动一个新的组件都会调用一次，找时间优化了 ，可以放到vuex 里面去取
      // this.queryInterfaceDataList();
      // this.queryReportList();
    },
    queryReportList() {
      const data = {
        parentId: 0,
        queryType: this.deviceDesignType,
      };
      getListAllV4(data).then((res) => {
        this.hrefPageList = res.dataList || [];
      });
    },
    addLinkParam() {
      let param = {
        param_name: "",
        params_value: "",
      };
      if (!this.singleActionItem.params) {
        this.singleActionItem.params = [];
      }

      this.singleActionItem.params.push(param);
      this.$forceUpdate();
    },
    // 获取接口数据列表
    queryInterfaceDataList() {
      getReportInterfaceList().then((res) => {
        this.interfaceApiAll = res.dataList;
      });
    },
    handleAddColumnInterfaceConfig(interfaceDataConfig) {
      if (!interfaceDataConfig) return false;
      interfaceDataConfig.paramsConfigs.push({
        param_name: "",
        param_value: "",
      });
      this.$forceUpdate();
    },
    handleAddColumnAction(interfaceDataConfig) {
      if (!interfaceDataConfig) return false;
      if (!interfaceDataConfig.statusActionList) {
        interfaceDataConfig.statusActionList = [];
      }
      interfaceDataConfig.statusActionList.push({
        actionType: "",
        interfaceDataConfig: {
          statusName: "",
          statusValue: "",
          hrefPageParams: [],
        },
      });
      this.$forceUpdate();
    },
    handleOptionsRemoveActionList(index, interfaceDataConfig) {
      interfaceDataConfig.splice(index, 1);
    },
    handleOptionsRemoveInterfaceConfig(index, interfaceDataConfig) {
      interfaceDataConfig.paramsConfigs.splice(index, 1);
    },
    handleChange(data, paramItem) {
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
        this.linkComponent(paramItem);
      } else if (paramItem.param_value_type == "V") {
        paramItem.type = data[0].type;
        paramItem.param_v_key = data[1].id;
        if (data[0].type == "customInterface") {
          paramItem.param_value = data[1].data.value;
          paramItem.operateApiId = data[0].id;
        } else {
          paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
        }
      } else if (paramItem.param_value_type == "B") {
        paramItem.type = data[0].type;
        if (data[0].type == "radio-button-tables") {
          paramItem.param_v_table = data[0].data.name;
          paramItem.param_v_key = data[1].id;
          paramItem.param_value = ""; // 接口值取不到的
        } else if (
          data[0].type == "radio-button-interface" ||
          data[0].type == "radio-button-connect"
        ) {
          paramItem.param_v_name = data[0].data.name;
          paramItem.middle = data[1].id;
          if (data.length > 2) {
            // 2022-02-25
            paramItem.param_v_key = data[2].id;
            paramItem.param_value = data[2].data.value; // 接口值取不到的
          } else {
            paramItem.operateApiId = data[0].id;
          }
        }
      }
      this.$forceUpdate();
    },
    changeImportInterface(id) {
      this.singleActionItem.interfaceDataConfig.paramsConfigs = [];
      if (id) {
        this.singleActionItem.interfaceDataConfig.operateApiId = id;
        this.queryProcessApiParamAndRes(id, "import");
      }
    },
    changeInterface(id) {
      this.singleActionItem.interfaceDataConfig.paramsConfigs = [];
      if (id) {
        this.singleActionItem.interfaceDataConfig.operateApiId = id;
        // this.queryProcessApiParamsService(id);

        // this.queryProcessApiResService(id);

        this.queryProcessApiParamAndRes(id);
      }
    },
    queryProcessApiParamAndRes(id, type) {
      const data = {
        processId: id,
      };
      getProcessParamService(data).then((res) => {
        let paramsList = res.data.params;
        paramsList &&
          paramsList.forEach((item) => {
            let param = {
              param_name: item.name,
            };
            if (type == "import") {
              param.custom = item.custom || false;
            }
            this.singleActionItem.interfaceDataConfig.paramsConfigs.push(param);
          });
        this.$forceUpdate();
        let interfaceName = res.data.processName;
        let obj = {
          label: interfaceName, // 依次判断数据接口、数据表、数据集
          value: {
            type: "customInterface",
            id: id,
            // data: res.data
          },
          children: [],
        };
        res.data.res &&
          res.data.res.forEach((rItem) => {
            let children = {
              label: rItem.name,
              value: {
                type: "customInterface",
                id: rItem.name,
                data: {
                  value: "",
                },
              },
            };
            obj.children.push(children);
          });
        this.$pageDataModelEngine.saveCustomInterfaceData(id, obj);
      });
    },

    // 获取接口数据入参
    queryProcessApiParamsService(id) {
      getProcessApiParamsService({ id }).then((res) => {
        let paramsList = res.data.params;
        paramsList &&
          paramsList.forEach((item) => {
            let param = {
              param_name: item.name,
            };
            this.singleActionItem.interfaceDataConfig.paramsConfigs.push(param);
          });
        this.$forceUpdate();
      });
    },
    queryProcessApiResService(id) {
      const data = {
        dataApiId: id,
        params: {},
      };
      getProcesseDataList(data).then((res) => {
        if (res.code === 0) {
          this.interfaceKeyList = [];

          // 2021-12-18 按照新逻辑 存取
          let interfaceName;
          this.interfaceApiAll.forEach((iItem) => {
            if (iItem.id == id) {
              interfaceName = iItem.name;
            }
          });
          let obj = {
            label: interfaceName, // 依次判断数据接口、数据表、数据集
            value: {
              type: "customInterface",
              id: id,
              // data: res.data
            },
            children: [],
          };
          for (const i in res.data) {
            this.interfaceKeyList.push(i);
            let paramValue = {
              type: "interface",
              operateApiId:
                this.singleActionItem.interfaceDataConfig.operateApiId,
            };
            let children = {
              label: i,
              value: {
                type: "customInterface",
                id: i,
                data: {
                  value: res.data[i],
                },
              },
            };
            obj.children.push(children);
          }
          this.$pageDataModelEngine.saveCustomInterfaceData(id, obj);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleHrefPage(reportId) {
      if (reportId) {
        const data = {
          reportId: reportId,
        };
        getReportDetail(data)
          .then((res) => {
            let data = res.data || {};
            // 上传组件存类型
            let configJson = JSON.parse(data.configJson || "{}");

            let paramList = configJson.config.pageParamsList;
            this.singleActionItem.interfaceDataConfig.hrefPageParams = [];
            paramList &&
              paramList.forEach((param) => {
                let data = {
                  operateHrefPageParamName: param.operateHrefPageParamName,
                };
                this.singleActionItem.interfaceDataConfig.hrefPageParams.push(
                  data
                );
              });
            this.$forceUpdate();
          })
          .catch(() => {
            // 上传组件失败存类型
            setStorage("subType", "");
          });
      } else {
        this.singleActionItem.interfaceDataConfig.hrefPageParams = [];
      }
    },

    chosenParam(item, radioItem) {
      item.param_value_type = radioItem.value;
      this.$forceUpdate();
    },
    saveActionSet(val) {
      this.singleActionItem.actionSet = val;
    },
    change() {
      this.$forceUpdate(); // 偶尔输入不了
    },
    changeLink() {
      if (this.singleActionItem.dynamic) {
        this.singleActionItem.linkDynamic = {};
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}
/deep/.el-collapse-item__header {
  padding-left: 20px;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 0;
}

// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
  line-height: 52px;
}
.review-div {
  margin-top: 10px;
}
.link-div {
  display: flex;
  align-items: center;
}
.link-operator {
  font-size: 18px;
  margin-left: 10px;
}
/deep/.el-form-item--small .el-radio {
  margin-right: 10px;
  line-height: 52px !important;
}
.colorSetting {
  position: relative;
  vertical-align: middle;
  line-height: 40px;
  display: flex;
  align-items: center;
  span {
    .iconStyle {
      font-size: 40px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }
    .iconStyles {
      font-size: 40px;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      margin-right: 10px;
    }
    .iconbottom {
      font-weight: bold;
      font-size: 12px;
    }
  }
  span:nth-child(2) {
    margin-top: -7px;
  }
  .doit {
    visibility: visible !important;
    opacity: 1 !important;
  }
}
</style>
