<template>
  <div class="value-config" style="padding: 10px 0px">
    <div>
      <div>工作流ID</div>
      <div>
        <!-- <el-select v-model="options.workflowId">
          <el-option-group
            v-for="group in workflowList"
            :key="group.id"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.workflowName"
              :label="item.workflowName"
              :value="item.id"
            >
            </el-option>
          </el-option-group>
        </el-select> -->
           <valueSelect
          :paramItem="options.workflowIdConfig"
          @handleChange="handleChange"
          style="padding: 10px 0px"
        />
      </div>

      <div>记录ID</div>
      <div>
        <!-- <valuesConfig
          :componentConfig="componentConfig"
          @onUpdateOptionsConfig="onUpdateOptionsConfig"
          @onChangeValuesConfig="onChangeValuesConfig"
        /> -->
        <valueSelect
          :paramItem="options.logIdConfig"
          @handleChange="handleChange"
          style="padding: 10px 0px"
        />
      </div>
      <div>当前用户ID</div>
      <div><el-select></el-select></div>
      <div>审批通过</div>
      <div>
        <el-cascader
          v-model="options.approveConfig.operateApiId"
          :show-all-levels="false"
          :options="interfaceApiNewAll"
          :props="{ value: 'queryId', label: 'name', emitPath: false }"
          @change="changeInterface"
        >
        </el-cascader>
        <el-form size="small" label-width="70px" class="label-left">
          <div style="padding: 10px 0 0">参数配置</div>
          <el-form-item
            :label="item.param_name"
            v-for="(item, index) in options.approveConfig.paramsConfigs"
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
      <div>审批拒绝</div>
      <div>
        <el-cascader
          v-model="options.rejectConfig.operateApiId"
          :show-all-levels="false"
          :options="interfaceApiNewAll"
          :props="{ value: 'queryId', label: 'name', emitPath: false }"
          @change="changeRejectInterface"
        >
        </el-cascader>
        <el-form size="small" label-width="70px" class="label-left">
          <div style="padding: 10px 0 0">参数配置</div>
          <el-form-item
            :label="item.param_name"
            v-for="(item, index) in options.rejectConfig.paramsConfigs"
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
    </div>
    <!--<el-form size="small" label-position="top" label-width="70px">

   <el-form-item label="工作流ID">
        <el-select v-model="options.workflowId">
          <el-option-group
            v-for="group in workflowList"
            :key="group.id"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.workflowName"
              :label="item.workflowName"
              :value="item.id"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="记录ID">
        <valuesConfig
          :componentConfig="componentConfig"
          @onUpdateOptionsConfig="onUpdateOptionsConfig"
          @onChangeValuesConfig="onChangeValuesConfig"
        />
      </el-form-item>
      <el-form-item label="当前用户ID">
        <el-select></el-select>
      </el-form-item>
      <el-form-item label="审批通过">
        <el-cascader
          v-model="options.operateApiId"
          :show-all-levels="false"
          :options="interfaceApiNewAll"
          :props="{ value: 'queryId', label: 'name', emitPath: false }"
          @change="changeInterface"
        >
        </el-cascader>
        <el-form size="small" label-width="70px" class="label-left">
          <div style="padding: 10px 0 0">参数配置</div>
          <el-form-item
            :label="item.param_name"
            v-for="(item, index) in options.interfaceDataConfig
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
      </el-form-item>
      <el-form-item label="审批拒绝">
        <el-select></el-select>
      </el-form-item>
    </el-form> -->
  </div>
</template>

<script>
import valuesConfig from "./values-config.vue";
import columnsValuesConfig from "@/views/report/layout/report-config-basics/basics-config/columns-values-config.vue";

import imgUpload from "@/views/report/layout/report-config-basics/basics-config/img-upload.vue";
import { inputFormBaseComponent } from "@/views/report/utils/common-const.js";
import Draggable from "vuedraggable";
import { getWorkFlowListAll } from "@/api/workflow/index";
import { getProcessParamService } from "@/api/process";
import {
  getReportTreeListV5Service,
  getProjectFileTreeListV5Service,
} from "@/api/v5";
import valueSelect from "@/views/report/layout/report-config-data/data-config-new/modules/interface-config/value-select.vue";

// modules
export default {
  components: {
    valuesConfig,
    columnsValuesConfig,
    imgUpload,
    Draggable,
    valueSelect,
  },
  props: {
    componentConfig: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      addColumnConfig: {
        label: "",
        value: "",
      },
      addBtnText: "添加选项",
      valuesList: [],
      workflowList: [],
      interfaceApiNewAll: [],
    };
  },
  watch: {},
  computed: {
    options() {
      console.log("componentConfig", this.componentConfig);
      return this.componentConfig.options;
    },
    containInputFormBase() {
      return inputFormBaseComponent.indexOf(this.componentConfig.type) == -1;
      //  return false;
    },
    echoConfig() {
      // input 组件的设置  不是回显 ，直接放在interfaceDataConfig
      if (
        this.componentConfig.type == "van-design-field" ||
        this.componentConfig.type == "van-design-calendar" ||
        this.componentConfig.type == "van-design-datetime-picker"
      ) {
        return false;
      }
      return true;
    },
  },

  created() {
    this.initFlowList();
    this.queryInterfaceDataList();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    initFlowList() {
      getWorkFlowListAll().then((res) => {
        this.workflowList = res.dataList;
      });
    },
    handleAddColumn() {
      let obj = (!this.isEmptyObject(this.addColumnConfig) &&
        JSON.parse(JSON.stringify(this.addColumnConfig))) || {
        value: "",
      };
      if (
        this.options.swipeImgList[0] &&
        this.options.swipeImgList[0].componentList
      )
        obj.componentList = []; // TODO: 临时解决方法，待优化
      this.options.swipeImgList.push(obj);
    },
    changeConfigValue(configOptions, configKey, value) {
      configOptions[configKey].value = value;
    },

    onUpdateOptionsConfig() {
      this.$emit("onUpdateOptionsConfig");
    },
    onChangeValuesConfig(data) {},
    isEmptyObject(obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    },
    queryInterfaceDataList() {
      return getProjectFileTreeListV5Service().then((res) => {
        this.interfaceApiNewAll.push({
          dataType: "directory",
          name: "后端接口",
          queryId: 1,
          rank: 1,
          treeId: 1,
          children: res.dataList || [],
        });
      });
    },
    changeInterface(id) {
      this.options.approveConfig.paramsConfigs = [];
      if (id) {
        this.options.approveConfig.operateApiId = id;
        // this.queryProcessApiParamsService(id);

        // this.queryProcessApiResService(id);

        this.queryProcessApiParamAndRes(id, "approveConfig");
      }
    },
    changeRejectInterface(id) {
      this.options.rejectConfig.paramsConfigs = [];
      if (id) {
        this.options.rejectConfig.operateApiId = id;
        // this.queryProcessApiParamsService(id);

        // this.queryProcessApiResService(id);

        this.queryProcessApiParamAndRes(id, "rejectConfig");
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
            if (type == "rejectConfig") {
              this.options.rejectConfig.paramsConfigs.push(param);
            } else {
              this.options.approveConfig.paramsConfigs.push(param);
            }
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
      });
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
  },
};
</script>
<style scoped lang="scss">
/deep/.el-cascader .el-input .el-input__inner::-webkit-input-placeholder {
  color: #333;
}
/deep/.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.value-select-div {
  display: flex;
}
.form-set {
  /deep/.el-form-item__label {
    line-height: 52px;
  }
}
</style>
