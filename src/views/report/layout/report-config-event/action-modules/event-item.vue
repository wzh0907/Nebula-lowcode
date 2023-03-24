<template>
  <div>
    <!------------------- 数据刷新 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-refresh'"
    >
      <el-select
        multiple
        filterable
        v-model="singleActionItem.operateRefresh"
        placeholder="请选择"
        :key="1"
      >
        <el-option
          v-for="(item, key) in refreshComponentList"
          :key="key"
          :label="item.options.commonConfigAssignName"
          :value="item.uuid"
        >
        </el-option>
      </el-select>
    </div>
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
    <!------------------- 表单提交 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-form-submit'"
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
    <div
      style="margin-top: 8px"
      v-if="singleActionItem.actionType === 'event-operate-display'"
    >
      <el-radio v-model="singleActionItem.displayAction" label="display"
        >显示</el-radio
      >
      <el-radio v-model="singleActionItem.displayAction" label="hide"
        >隐藏</el-radio
      >
      <el-radio v-model="singleActionItem.displayAction" label="switch"
        >切换</el-radio
      >
    </div>
    <!------------------- 接口调用 TODO::: 接口调用需要与eventItem互相循环引用，不太好分成两个组件 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-interface'"
    >
      <el-select
        v-model="singleActionItem.operateApiId"
        placeholder="请选择"
        clearable
        :key="2"
        @change="changeInterface"
      >
        <el-option
          v-for="item in interfaceApiAll"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <!-- 参数配置 -->
      <el-form size="small" label-width="70px" class="label-left">
        参数配置
        <el-form-item
          :label="item.param_name"
          v-for="(item, index) in singleActionItem.interfaceDataConfig
            .paramsConfigs"
          :key="index"
        >
          <valueSelect
            :paramItem="item"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
      </el-form>
    </div>
    <!------------------- 对话框 ------------------>
    <actionDialogBoxView
      :actionItem="singleActionItem"
      :hrefPageList="hrefPageList"
      :varDataObj="varDataObj"
      @handleHrefPage="handleHrefPage"
    />
    <!------------------- 页面跳转 ------------------>
    <div
      style="padding-top: 10px"
      v-if="
        singleActionItem.actionType === 'event-operate-href' ||
        singleActionItem.actionType === 'event-operate-href-reload' ||
        singleActionItem.actionType === 'event-operate-close-page'
      "
    >
      <el-select
        v-model="singleActionItem.operateHrefPageId"
        placeholder="请选择"
        :key="3"
        @change="handleHrefPage"
      >
        <el-option
          v-for="(item, key) in hrefPageList"
          :key="key"
          :label="item.reportName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div style="padding-top: 10px">
        参数配置
        <actionHrefView
          :actionItem="singleActionItem"
          :varDataObj="varDataObj"
        />
      </div>
    </div>
    <!------------------- 子页面跳转 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-href-subpage'"
    >
      <el-select
        v-model="singleActionItem.subpageIndex"
        placeholder="请选择"
        :key="3"
      >
        <el-option
          v-for="(item, key) in subpageList"
          :key="key"
          :label="'子页面 #' + (key + 2)"
          :value="key"
        >
        </el-option>
      </el-select>
      <div style="padding-top: 10px">
        <actionHrefView
          :actionItem="singleActionItem"
          :varDataObj="varDataObj"
        />
      </div>
    </div>
    <!------------------- app页面跳转 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-href-native'"
    >
      <el-input
        v-model="singleActionItem.operateHrefPageNative"
        class="header_title"
        size="small"
        placeholder="请输入页面名称"
        :key="4"
      />
    </div>
    <!------------------- 逻辑判断配置 ------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-logic-judgment'"
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
    <!------------------- 流程图线节点配置 ------------------>
    <div
      style="padding-top: 10px; text-align: center"
      v-if="singleActionItem.actionType === 'flow-chart-line-config'"
    >
      <div style="padding-bottom: 10px">
        <el-switch
          v-model="singleActionItem.value"
          active-text="真"
          inactive-text="假"
        >
        </el-switch>
      </div>
      <el-button
        type="primary"
        size="small"
        @click="$emit('onSaveLineConfig', singleActionItem)"
        >保存</el-button
      >
    </div>
    <!-------------------------- 页面返回  ------------------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-back'"
    >
      返回到前一个页面
    </div>
    <!-------------------------- 组件设值  ------------------------------>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-set'"
    >
      设置一个组件的值
      <eventActionSet
        :singleActionItem="singleActionItem.actionSet"
        :actionSet="actionSet"
        @saveActionSet="saveActionSet"
      ></eventActionSet>
    </div>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-dialog-box-msg'"
    >
      提示框
      <div>
        提示消息
        <el-input
          type="textarea"
          v-model="singleActionItem.popupBody"
        ></el-input>
      </div>
    </div>
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-dialog-box-confirm'"
    >
      确认框
      <div>
        确认消息
        <el-input
          type="textarea"
          v-model="singleActionItem.popupBody"
        ></el-input>
      </div>
    </div>
    <!----------------------- 拨打电话 --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-make-phone-call'"
    >
      <el-form size="small" label-width="70px" class="label-left">
        <el-form-item label="手机号">
          <valueSelect
            :paramItem="singleActionItem"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
      </el-form>
    </div>
    <!----------------------- 主页跳转 --------------------------->
    <div
      style="padding-top: 10px"
      v-if="singleActionItem.actionType === 'event-operate-main-menu-href'"
    >
      主页跳转
      <el-form size="small" label-width="70px" class="label-left">
        <el-form-item label="用户名称">
          <valueSelect
            :paramItem="singleActionItem.paramUser"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
        <el-form-item label="Token">
          <valueSelect
            :paramItem="singleActionItem.paramToken"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
        <el-form-item label="用户权限">
          <valueSelect
            :paramItem="singleActionItem.paramAuth"
            :isBind="true"
            @handleChange="handleChange"
            style="padding: 10px 0px"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * 事件行为配置
 */
import {
  getLocalData,
  saveAndUpdateLocalData,
  saveAndUpdatePageLocalData,
} from "@/views/report/utils/deal-data-cache/index";
import {
  getProcessApiParamsService,
  getProcesseDataList,
  getReportInterfaceList,
  getReportDetail,
} from "@/api/chartsData";

import { getProcessParamService } from "@/api/process";

import { getListAllV4 } from "@/api/report";
import eventActionView from "./event-item.vue"; // TODO::: 引入自身组件，循环引入
import actionHrefView from "./action-href.vue";
import actionDialogBoxView from "./action-dialog-box.vue";

import eventActionSet from "./event-action-set.vue";
import { lastDay, currentUnitDay, lastUnitDay } from "@/utils/dateUtils.js";
import Vue from "vue";
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
export default {
  name: "eventActionView",
  components: {
    eventActionView,
    actionHrefView,
    actionDialogBoxView,
    eventActionSet,
    valueSelect,
  },
  watch: {},
  props: {
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
  },
  data() {
    return {
      radio: "",
      radio1: "",
      singleActionItem: this.actionItem,
      varDataObj: {},
      interfaceKeyList: {},
      hrefPageList: [],
      paramsActiveNames: "",
      statusActiveNames: "",
      interfaceApiAll: [],
      processApiParamsList: [], // 接口参数列表
      actionTypeList: [
        {
          label: "数据刷新",
          value: "event-operate-refresh",
        },
        {
          label: "隐藏/显示",
          value: "event-operate-display",
        },
        {
          label: "页面跳转",
          value: "event-operate-href",
        },
        {
          label: "页面跳转（本页面）",
          value: "event-operate-href-reload",
        },
        {
          label: "页面跳转（子页面）",
          value: "event-operate-href-subpage",
        },
        {
          label: "页面跳转(Native)",
          value: "event-operate-href-native",
        },
        {
          label: "关闭弹窗",
          value: "event-operate-close-dialog",
        },
        {
          label: "逻辑判断",
          value: "event-operate-logic-judgment",
        },
        {
          label: "关闭传值",
          value: "event-operate-close-page",
        },
      ],
      actionSet: this.actionItem.actionSet,
    };
  },
  watch: {
    actionItem(val) {
      this.singleActionItem = val; //新增result的watch，监听变更并同步到myResult上
    },
  },
  created() {
    // console.log(lastUnitDay(1,'year',true))
    console.log(lastDay(2));
    // this.varDataObj = getLocalData()
    this.varDataObj = this.$pageDataModelEngine.getCustomData();
    // TODO 每次打开流程或者拖动一个新的组件都会调用一次，找时间优化了 ，可以放到vuex 里面去取
    this.queryInterfaceDataList();
    this.queryReportList();
  },
  methods: {
    queryReportList() {
      const data = {
        parentId: 0,
        queryType: this.deviceDesignType,
      };
      getListAllV4(data).then((res) => {
        this.hrefPageList = res.dataList || [];
      });
    },
    // 获取接口数据列表
    queryInterfaceDataList() {
      getReportInterfaceList().then((res) => {
        this.interfaceApiAll = res.dataList;
      });
    },
    // linkComponent(paramsItem) {
    //   let uuid = paramsItem.relevanceComponentUuid;
    //   this.componentUUIDList.forEach(item => {
    //     if (item.uuid === uuid) {
    //       paramsItem.param_value = item.options.value;
    //     }
    //   });
    // },
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
      console.log("event handleChange", data, paramItem);
      if (paramItem.param_value_type == "T") {
        paramItem.relevanceComponentUuid = data[1].id;
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
        } else if (data[0].type == "radio-button-interface") {
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
    changeInterface(id) {
      this.singleActionItem.interfaceDataConfig.paramsConfigs = [];
      if (id) {
        this.singleActionItem.interfaceDataConfig.operateApiId = id;
        // this.queryProcessApiParamsService(id);

        // this.queryProcessApiResService(id);

        this.queryProcessApiParamAndRes(id);
      }
    },
    queryProcessApiParamAndRes(id) {
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
            // 存储数据到本地
            // saveAndUpdateLocalData(i, res.data[i])
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
          console.log("----------------", obj);
          this.$pageDataModelEngine.saveCustomInterfaceData(id, obj);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleHrefPage(reportId) {
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
</style>
