<template>
  <div style="padding-left: 20px" class="group-wrap">
    <el-form label-width="70px" class="label-left">
      <el-form-item prop="name" label="节点名称">
        <el-input
          v-model="singleActionItem.name"
          @input="inputchange"
        ></el-input>
      </el-form-item>
      <!-- 审批节点 -->
      <div
        style="padding-top: 10px"
        v-if="singleActionItem.actionType === 'work-flow-approval'"
      >
        <el-form-item prop="name" label="审批人">
          <el-radio v-model="singleActionItem.approveBy" label="user"
            >员工</el-radio
          >
          <!-- <el-radio v-model="singleActionItem.approveBy" label="level"
            >上级</el-radio
          > -->
          <el-radio v-model="singleActionItem.approveBy" label="dept"
            >部门</el-radio
          >
        </el-form-item>

        <el-form-item
          v-if="singleActionItem.approveBy == 'user'"
          label="目录树"
        >
          <el-cascader
            v-model="singleActionItem.approveUserList"
            :options="userTreeList"
            :props="{ label: 'name', value: 'id', multiple: true }"
            @change="handleUserChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-if="singleActionItem.approveBy == 'level'"
          label="审批级数"
        >
          <el-select
            v-model="singleActionItem.approveLevel"
            placeholder="请选择"
            style="width: 180px; line-height: 52px"
          >
            <el-option
              v-for="levelItem in levelList"
              :label="levelItem.name"
              :value="levelItem.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="singleActionItem.approveBy == 'dept'"
          label="目录树"
        >
          <el-cascader
            v-model="singleActionItem.approveDeptList"
            :options="deptTreeList"
            :props="{ label: 'name', value: 'id', checkStrictly: true }"
            @change="handleUserChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item prop="name" label="审批方式">
          <el-select v-model="singleActionItem.methods"   style="width: 215px; line-height: 52px">
            <el-option
              v-for="(workItem, key) in approvalMethods"
              :key="key"
              :value="workItem.value"
              :label="workItem.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="name" label="审批意见">
          <el-checkbox v-model="singleActionItem.adoptRequired">通过时必填</el-checkbox>
          <el-checkbox v-model="singleActionItem.rejectRequired"
            >否定时必填</el-checkbox
          >
        </el-form-item>
      </div>
      <!-- 审批业务处理节点 -->
      <div
        style="padding-top: 10px"
        v-if="singleActionItem.actionType === 'work-flow-business-handler'"
      >
        <el-form-item prop="name" label="条件服务">
          <el-select
            v-model="singleActionItem.operateApiId"
            filterable
            clearable
            placeholder="请选择"
            style="width: 180px; line-height: 52px"
            @change="changeInterface"
          >
            <div v-for="group in interfaceApiAll" :key="group.label">
              <el-option-group
                v-if="group.dataType == 'directory'"
                :key="group.treeId"
                :label="group.name"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.treeId"
                  :label="item.name"
                  :value="item.queryId"
                >
                </el-option>
              </el-option-group>
              <el-option
                v-else
                :key="group.treeId"
                :label="group.name"
                :value="group.queryId"
              >
              </el-option>
            </div>
          </el-select>
        </el-form-item>
        <!-- 参数配置 -->
          <div style="padding: 10px 0 0">输入参数</div>
        <el-form-item   v-for="(item, index) in singleActionItem.interfaceDataConfig
              .paramsConfigs"
            :key="index"
            :label="item.param_name"
             >
    
            <!-- TODO -->
            <el-select
              v-model="item.param_value"
              style="width: 180px; line-height: 52px"
            >
              <el-option
                v-for="(workItem, key) in workFlowParams"
                :key="key"
                :value="workItem.name"
                >{{ workItem.name }}</el-option
              >
            </el-select>
        </el-form-item>
      </div>
      <!-- 审批条件节点 -->

      <div
        style="padding-top: 10px"
        v-if="singleActionItem.actionType === 'work-flow-if'"
      >
        <valueSelect
          :paramItem="singleActionItem"
          :isBind="true"
          @handleChange="handleChange"
          style="padding: 10px 0px"
        />
        <!-- 判断 -->
        <el-input
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
    </el-form>
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
import eventActionView from "@/views/report/layout/report-config-event/action-modules/event-item.vue"; // TODO::: 引入自身组件，循环引入
import actionHrefView from "@/views/report/layout/report-config-event/action-modules//action-href.vue";
import actionDialogBoxView from "@/views/report/layout/report-config-event/action-modules//action-dialog-box.vue";

import eventActionSet from "@/views/report/layout/report-config-event/action-modules//event-action-set.vue";
import eventDialogBox from "@/views/report/layout/report-config-event/action-modules//event-dialog-box.vue";
import { lastDay, currentUnitDay, lastUnitDay } from "@/utils/dateUtils.js";
import Vue from "vue";
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";
import { getWorkFlowUserTree } from "@/api/workflow/index";
export default {
  name: "eventActionView",
  components: {
    eventActionView,
    actionHrefView,
    actionDialogBoxView,
    eventActionSet,
    eventDialogBox,
    valueSelect,
  },
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
    interfaceApiAll: {
      type: Array,
      default: () => [],
    },
    interfaceApiNewAll: {
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
      singleActionItem: {
        name: null,
      },
      userTreeList: [],
      deptTreeList: [],
      varDataObj: {},
      interfaceKeyList: {},
      // hrefPageList: [],
      paramsActiveNames: "",
      statusActiveNames: "",
      // interfaceApiAll: [],
      processApiParamsList: [], // 接口参数列表
      levelList: [
        {
          name: "最高级",
        },
        {
          name: "2级",
        },
        {
          name: "3级",
        },
        {
          name: "4级",
        },
        {
          name: "5级",
        },
        {
          name: "6级",
        },
        {
          name: "7级",
        },
        {
          name: "8级",
        },
        {
          name: "9级",
        },
      ],
      workFlowParams: [
        {
          name: "记录ID",
        },
        {
          name: "待审核人",
        },
        {
          name: "审核人(上个节点)",
        },
        {
          name: "审核意见(上个节点)",
        },
        {
          name: "发起人ID",
        },
      ],
      approvalMethods: [
        {
          name: "或签（一名审批人通过或否决即可）",
          value: "1",
        },
        {
          name: "会签（需所有审批人通过）",
          value: "2",
        },
        {
          name: "会签（只需一名审批人通过，否决需全员否决）",
          value: "3",
        },
      ],
      workFlow: {
        operateApiId: null,
        zhuji: false,
        param: "",
        methods: "",
        page: "",
        adoptRequired: false,
        rejectRequired: false,
      },
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
  mounted() {},
  methods: {
    init(diagram) {
      console.log("right menu init", diagram);
      this.singleActionItem = diagram.properties;
      this.title = diagram.title;
      if (!this.singleActionItem.name) {
        this.singleActionItem.name = diagram.title;
      }

      console.log("----------------init", this.varDataObj);
      this.initUserTree();
      // this.varDataObj = this.$pageDataModelEngine.getCustomData();
      // // TODO 每次打开流程或者拖动一个新的组件都会调用一次，找时间优化了 ，可以放到vuex 里面去取
      // this.queryInterfaceDataList();
      // this.queryReportList();
    },
    initUserTree() {
      getWorkFlowUserTree().then((res) => {
        this.userTreeList = res.data.data.userList;
        this.deptTreeList = res.data.data.deptList;
        console.log("--------------", res, this.userTreeList);
      });
    },
    handleUserChange(data) {
      console.log("---------user", data);
      this.singleActionItem.approveUserId = "";
      data &&
        data.forEach((item) => {
          if (item.length > 0) {
            this.singleActionItem.approveUserId +=
              item[item.length - 1] + ",";
          }
        });
      if (this.singleActionItem.approveUserId.length > 0) {
        this.singleActionItem.approveUserId =
          this.singleActionItem.approveUserId.substring(
            0,
            this.singleActionItem.approveUserId.length - 1
          );
      }
      console.log(
        "---------this.singleActionItem.approveUserId----",
        this.singleActionItem.approveUserId
      );
    },
    inputchange() {
      this.$forceUpdate();
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
        // console.log('12341234', paramItem, data)
        if (data.length === 3) {
          // TODO:: 待优化 目前组件有三层的是Table组件（特殊处理）
          paramItem.param_v_key = data[2].data.value;
        }
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
    savePopupValue(val) {
      this.singleActionItem.popupBody = val;
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
/deep/.el-form-item__content{
  line-height: 52px !important;
}
.group-wrap {
  /deep/.el-input {
    width: 160px;
    line-height: 40px;
  }
  /deep/.el-input--suffix {
    width: 100%;
  }
  /deep/.el-select {
    width: 100%;
  }
  /deep/.menu-item-select-middle {
    width: 90px;
  }
  .menu-item-select-middle {
    /deep/.el-input {
      width: 100%;
    }
  }
}
</style>
