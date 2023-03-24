<script>
/**
 * 
 * 已废弃，不要再修改这里的代码，已迁移到report-config-data内
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
>>>>>>> develop
 */
import { pickInputComponentList } from "@/views/report/utils/deal-component-data/transform-component-list";
import {
  saveAndUpdateLocalData,
  getLocalData,
} from "@/views/report/utils/deal-data-cache/index";
import {
  getReportInterfaceList,
  getProcesseDataList,
  getProcessApiParamsService,
  getReductionDataSetListService,
  getReportDaSetList,
  getReportDefinition,
  getOpenDatasetResult,
  getTablesListApiService,
  getOpenDataTableResult,
} from "@/api/chartsData";
import { getTableFieldService } from "@/api/database";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "radio-button-group",
  props: ["componentList", "componentConfig", "config", "interfaceDataConfig"],
  data() {
    return {
      varDataObj: {},
      dataOriginComponentVarDataObjMap: {},
      interfaceApiAll: [], // 接口数据列表
      interfaceData: {},
      apiInterfaceData: {},
      datasetInterfaceData: [],
      interfaceKeyList: [],
      selectedChartDataList: [],
      datasetList: [], // 数据集列表
      datasetResData: [], // 数据集结果
      tablesListApi: [], // 数据库表列表
      tableFieldList: [],
      // 组件渲染
      formType: "",
      formKey: "",
      // formTypeConfigs: [],
      // ######## 参数
      paramsActiveNames: "",
      queryActiveNames: "",
      processApiParamsList: [],
      datasetParamsList: [],
      componentUuidList: [],
      // 条件
      operatorMap: [
        {
          name: "=",
          value: "=",
        },
        {
          name: "!=",
          value: "!=",
        },
        {
          name: ">",
          value: ">",
        },
        {
          name: "<",
          value: "<",
        },
        {
          name: ">=",
          value: ">=",
        },
        {
          name: "<=",
          value: "<=",
        },
        {
          name: "包含",
          value: "include",
        },
        {
          name: "前包含",
          value: "beforeInclude",
        },
        {
          name: "后包含",
          value: "afterInclude",
        },
      ],
    };
  },
  created() {
    this.initData();
    this.queryTablesListApiService();
    this.queryInterfaceDataList();
    this.queryReportDaSetList();
    this.handleVarDataList();
  },
  mounted() {
    if (this.interfaceDataConfig.id) {
      this.initApi(true);
      // this.handleTypeConfig(this.componentConfig.options[this.config.key])
    }
    this.handleTypeConfig(this.componentConfig.options[this.config.key]);
    // let tempArr = []
    // this.transformComponentListTreeToPlan(this.componentList, tempArr)
    // this.componentUuidList = tempArr
    this.filterInputComment();
  },
  methods: {
    // 拿到过滤后的 input 组件
    filterInputComment() {
      let tempArr = [];
      this.pickInputComponentList(this.componentList, tempArr);
      this.componentUuidList = tempArr;
    },
    pickInputComponentList,
    handleVarDataList() {
      // 获取本地存储的配置属性
      // let str = getStorage('_var_data_list_') || '{}'
      // let obj = JSON.parse(str)
      this.varDataObj = getLocalData();
      let obj = this.varDataObj;
      // 处理数据表的本地存储
      // console.log('xxxxxxxxxxxxx', this.componentConfig, obj)
      if (this.componentConfig.options._data_origin_component_uuid) {
        // console.log(obj, this.componentConfig.options._data_origin_component_uuid)
        let objTemp =
          obj[this.componentConfig.options._data_origin_component_uuid] || [];
        this.dataOriginComponentVarDataObjMap = objTemp[0] || {};
      }
    },
    onChangeBindDataKey() {
      // this.interfaceDataConfig.value = this.dataOriginComponentVarDataObjMap[this.interfaceDataConfig.bindDataKey]
      this.$set(
        this.interfaceDataConfig,
        "value",
        this.dataOriginComponentVarDataObjMap[
          this.interfaceDataConfig.bindDataKey
        ]
      );
      // console.log(this.componentConfig)
      // if (this.componentConfig.options._data_origin_component_uuid) {

      // }
    },
    changeItemName(item, selectItemList) {
      selectItemList.forEach((optionItem) => {
        if (item.param_name === optionItem.name) {
          item.displayName = optionItem.displayName;
          item.fieldType = optionItem.fieldType || optionItem.type;
        }
      });
    },
    initData() {
      if (
        !this.interfaceDataConfig.paramsConfigs ||
        typeof this.interfaceDataConfig.paramsConfigs.push !== "function"
      ) {
        this.$set(this.interfaceDataConfig, "paramsConfigs", [
          {
            param_name: "",
            param_value: "",
          },
        ]);
      }
      if (
        !this.interfaceDataConfig.queryConfigs ||
        typeof this.interfaceDataConfig.queryConfigs.push !== "function"
      ) {
        this.$set(this.interfaceDataConfig, "queryConfigs", [
          {
            param_name: "",
            operator: "",
            param_value: "",
            param_value_type: "",
          },
        ]);
      }
    },
    chooseInterfaceDataKey(key) {
      this.clearChartSettings();
      if (this.formType === "interface-text-title") {
        // this.getInterfaceDataValue(key)
        this.interfaceDataConfig.value = this.apiInterfaceData[key];
      } else if (this.formType === "interface-qrcode-src") {
        this.interfaceDataConfig.value = this.apiInterfaceData[key];
        this.componentConfig.options.value = this.apiInterfaceData[key];
        console.log("--------++++++++", this.componentConfig.options);
      } else {
        this.pickChartData(key);
      }
      // 保存到本地缓存，做数据绑定使用
      let listTemp = this.apiInterfaceData[key];
      if (listTemp && typeof listTemp.push === "function") {
        // saveAndUpdateLocalData(this.componentConfig.uuid, listTemp || [])
      } else {
        this.pickChartData(key);
        // saveAndUpdateLocalData(this.componentConfig.uuid, listTemp || [])
        let str = getStorage("_var_data_list_") || "{}";
        let obj = JSON.parse(str);
        obj[this.componentConfig.uuid] = listTemp || [];
        setStorage("_var_data_list_", JSON.stringify(obj));
      }
    },
    chooseInterfaceDataEchoKey(key) {
      this.clearChartSettings();
      if (this.formType === "interface-chart-echo") {
        // this.getInterfaceDataValue(key)
        this.interfaceDataConfig.value = this.apiInterfaceData[key];
        if (this.componentConfig.type === "van-design-checkbox") {
          var temp = this.apiInterfaceData[key];
          this.componentConfig.options.defaultValue = temp.split(",");
          this.componentConfig.options.value = temp.split(",");
        } else {
          this.componentConfig.options.value = this.apiInterfaceData[key];
        }
      }
      //  else if(){
      //   this.interfaceDataConfig.value = this.apiInterfaceData[key]
      //     this.componentConfig.options.color = this.apiInterfaceData[key]
      // }
      else {
        this.pickChartData(key);
      }
    },
    chooseQrCodeInterfaceDataValue(key) {
      this.interfaceDataConfig.color = this.apiInterfaceData[key];
      this.componentConfig.options.color = this.apiInterfaceData[key];

      console.log("chooseQrCodeInterfaceDataValue", this.componentConfig);
    },
    linkComponent(paramsItem) {
      let uuid = paramsItem.relevanceComponentUuid;
      this.componentUuidList.forEach((item) => {
        if (item.uuid === uuid) {
          paramsItem.param_value = item.options.value;
        }
      });
    },
    pickChartData(key, data) {
      this.selectedChartDataList = data || this.apiInterfaceData[key] || [];
      // this.interfaceDataConfig.chartData.rows = this.selectedChartDataList
      let temp = [];
      if (this.formType === "interface-chart-table") {
        this.interfaceDataConfig.tableData = [];
        temp = this.interfaceDataConfig.tableData;
      } else {
        if (!this.interfaceDataConfig.chartData) return false;
        this.interfaceDataConfig.chartData.rows = [];
        temp = this.interfaceDataConfig.chartData.rows;
      }
      this.selectedChartDataList.forEach((item, index) => {
        // if (index >= 6) return false // TODO::: 最多六条数据，调试用，上线要删掉
        temp.push(item);
      });
    },
    // getInterfaceDataValue(key) {
    //   this.interfaceDataConfig.value = this.apiInterfaceData[key]
    // },
    initApi(isNoClear) {
      if (this.interfaceDataConfig.dataSetId) {
        this.queryDataset(this.interfaceDataConfig.dataSetId, isNoClear);
      }
      if (this.interfaceDataConfig.tableId) {
        this.queryTablesListApiService().then(() => {
          this.queryDataTableField(this.interfaceDataConfig.tableId, isNoClear);
        });
      }
      if (this.interfaceDataConfig.apiId) {
        this.dataProcessing(this.interfaceDataConfig.apiId);
        this.queryProcessApiParamsService(this.interfaceDataConfig.apiId);
      }
    },
    // 获取接口相关
    queryApi(id) {
      this.clearChartSettings();
      this.interfaceDataConfig.id = id;
      this.dataProcessing(id);
      this.queryProcessApiParamsService(id);
    },
    // 接口查询
    queryTablesListApiService() {
      return getTablesListApiService().then((res) => {
        this.tablesListApi = res.dataList;
      });
    },
    queryDataTableField(tableId, isNoClear) {
      !isNoClear && this.clearChartSettings();
      this.interfaceDataConfig.id = tableId;
      this.tablesListApi.forEach((tableItem) => {
        // 保存数据集名称
        if (tableId === tableItem.tableId) {
          this.interfaceDataConfig.tableName = tableItem.tableName;
          this.interfaceDataConfig.dbConfigId = tableItem.dbConfigId;
        }
      });
      let dbConfigId = "";
      let tableName = "";
      this.tablesListApi.forEach((table) => {
        if (table.tableId === tableId) {
          dbConfigId = table.dbConfigId;
          tableName = table.tableName;
        }
      });
      getTableFieldService({ dbConfigId, tableName, tableId }).then((res) => {
        this.tableFieldList = res.dataList;
        // this.pickChartData('', this.tableFieldList) // TODO:::test 待处理
      });
      // 条件查询数据表数据
      this.queryOpenDataTableResult();
    },
    // 数据表条件查询
    queryOpenDataTableResult() {
      let dbConfigId = this.interfaceDataConfig.dbConfigId;
      let tableName = this.interfaceDataConfig.tableName;
      let queryConfigs = this.interfaceDataConfig.queryConfigs || [];
      let conditionList = [];
      queryConfigs.forEach((queryConfig) => {
        if (
          !queryConfig.param_name ||
          !queryConfig.operator ||
          !queryConfig.param_value
        )
          return false;
        let obj = {
          columnName: queryConfig.param_name,
          columnAlias: queryConfig.param_name,
          columnType: queryConfig.fieldType,
          operator: queryConfig.operator,
          conditionVal: queryConfig.param_value,
          conditionType: queryConfig.param_value_type,
        };
        conditionList.push(obj);
      });
      let params = {
        id: dbConfigId,
        name: tableName,
        conditionList,
        page: {
          pageIndex: 1,
          pageSize: 20,
        },
        orderBy: [{}],
      };
      getOpenDataTableResult(params).then((res) => {
        this.pickChartData("", res.dataList);
        // 保存到本地缓存，做数据绑定使用
        // saveAndUpdateLocalData(this.componentConfig.uuid, res.dataList || [])
        // let str = getStorage('_var_data_list_') || '{}'
        // let obj = JSON.parse(str)
        // obj[this.componentConfig.uuid] = res.dataList || []
        // setStorage('_var_data_list_', JSON.stringify(obj))
      });
    },
    // 获取数据集结果
    queryDataset(dataSetId, isNoClear) {
      !isNoClear && this.clearChartSettings();
      this.interfaceDataConfig.id = dataSetId;
      this.datasetList.forEach((datasetItem) => {
        // 保存数据集名称
        if (dataSetId === datasetItem.id) {
          this.interfaceDataConfig.dataSetName = datasetItem.dataSetName;
        }
      });
      this.queryReductionDataSetListService(dataSetId);
      let params = {
        id: dataSetId,
        name: this.interfaceDataConfig.dataSetName,
        conditionList: [],
        page: {
          pageIndex: 1,
          pageSize: 20,
        },
        orderBy: [
          // {'区域销售总额': 'asc'}
        ],
      };
      // getReportDefinition
      getOpenDatasetResult(params).then((res) => {
        this.datasetResData = res.dataList;
        this.datasetInterfaceData = res.dataList;
        this.pickChartData("", this.datasetInterfaceData);
        // 保存到本地缓存，做数据绑定使用
        // saveAndUpdateLocalData(this.componentConfig.uuid, res.dataList || [])
        // let str = getStorage('_var_data_list_') || '{}'
        // let obj = JSON.parse(str)
        // obj[this.componentConfig.uuid] = res.dataList || []
        // setStorage('_var_data_list_', JSON.stringify(obj))
      });
    },
    // 获取数据集列表
    queryReportDaSetList() {
      getReportDaSetList().then((res) => {
        this.datasetList = res.dataList || [];
      });
    },
    // 获取数据集数据
    queryReductionDataSetListService(id) {
      getReductionDataSetListService({ id }).then((res) => {
        this.datasetParamsList = res.data.params;
        // this.processApiParamsList = res.data.params
      });
    },
    // 获取接口数据入参
    queryProcessApiParamsService(id) {
      getProcessApiParamsService({ id }).then((res) => {
        this.processApiParamsList = res.data.params;
      });
    },
    // 获取接口数据列表
    queryInterfaceDataList() {
      getReportInterfaceList().then((res) => {
        this.interfaceApiAll = res.dataList;
      });
    },
    // 获取数据加工
    dataProcessing(id) {
      const data = {
        dataApiId: id,
        params: {},
      };
      getProcesseDataList(data).then((res) => {
        if (res.code === 0) {
          this.interfaceKeyList = [];
          this.apiInterfaceData = res.data;
          for (const i in res.data) {
            this.interfaceKeyList.push(i);
          }
          this.interfaceDataConfig.key &&
            this.pickChartData(this.interfaceDataConfig.key);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 页面组件渲染
    changeRadioValue(value) {
      // 数据配置：横轴、纵轴
      this.clearChartSettings();
      // 清除其他所有选中的ID
      this.interfaceDataConfig.apiId = "";
      this.interfaceDataConfig.dataSetId = "";
      this.interfaceDataConfig.tableId = "";

      if (
        this.componentConfig.options[this.config.key] === "radio-button-dataset"
      ) {
        this.interfaceDataConfig.id = this.interfaceDataConfig.dataSetId;
        this.pickChartData("", this.datasetInterfaceData);
      } else if (
        this.componentConfig.options[this.config.key] === "radio-button-tables"
      ) {
        this.interfaceDataConfig.id = this.interfaceDataConfig.tableId;
        this.pickChartData("", this.tableFieldList);
      } else if (
        this.componentConfig.options[this.config.key] ===
        "radio-button-interface"
      ) {
        this.interfaceDataConfig.id = this.interfaceDataConfig.apiId;
        this.pickChartData(this.interfaceDataConfig.key);
      }
      this.handleTypeConfig(value);
    },
    clearChartSettings() {
      if (!this.interfaceDataConfig.chartSettings) return false;
      this.interfaceDataConfig.chartSettings.dimension =
        typeof this.interfaceDataConfig.chartSettings.dimension === "object"
          ? []
          : "";
      this.interfaceDataConfig.chartSettings.metrics =
        typeof this.interfaceDataConfig.chartSettings.metrics === "object"
          ? []
          : "";
      if (this.interfaceDataConfig.chartSettings.showLine)
        this.interfaceDataConfig.chartSettings.showLine = [];
    },
    clearChartEchoSettings() {
      if (!this.interfaceDataEchoConfig.chartSettings) return false;
      this.interfaceDataEchoConfig.chartSettings.dimension =
        typeof this.interfaceDataEchoConfig.chartSettings.dimension === "object"
          ? []
          : "";
      this.interfaceDataEchoConfig.chartSettings.metrics =
        typeof this.interfaceDataEchoConfig.chartSettings.metrics === "object"
          ? []
          : "";
      if (this.interfaceDataEchoConfig.chartSettings.showLine)
        this.interfaceDataEchoConfig.chartSettings.showLine = [];
    },
    handleTypeConfig(value) {
      // 获取配置类型
      let isThePick = false;
      this.config.typeConfigs.forEach((item) => {
        if (item.value === value && item.formType) {
          isThePick = true;
          this.formType = item.formType;
          this.formKey = item.key;
          // this.formTypeConfigs = item.typeConfigs
        }
      });
      if (!isThePick) {
        this.formType = "";
        this.formKey = "value";
        // this.formTypeConfigs = []
      }
    },
    // ######## 参数
    handleAddColumn() {
      let obj = {
        param_name: "",
        param_value: "",
      };
      this.interfaceDataConfig.paramsConfigs.push(obj);
    },
    handleOptionsRemove(index) {
      this.interfaceDataConfig.paramsConfigs.splice(index, 1);
    },
    handleEchoOptionsRemove(index) {
      this.interfaceDataEchoConfig.paramsConfigs.splice(index, 1);
    },
    handleAddColumnCondition() {
      let obj = {
        param_name: "",
        param_value: "",
        param_value_type: "",
      };
      this.interfaceDataConfig.queryConfigs.push(obj);
    },
    handleOptionsRemoveCondition(index) {
      this.interfaceDataConfig.queryConfigs.splice(index, 1);
    },
    handleEhcoOptionsRemoveCondition(index) {
      this.interfaceDataEchoConfig.queryConfigs.splice(index, 1);
    },
  },
};
</script>

<template>
  <!-- 方块单选 -->
  <el-radio-group
    v-model="componentConfig.options[config.key]"
    size="small"
    style="padding-bottom: 10px; width: 100%"
    @change="changeRadioValue"
  >
    <el-radio-button
      :label="item.value"
      v-for="(item, key) in config.typeConfigs"
      :key="key"
      >{{ item.label }}</el-radio-button
    >
    <!-- 默认 -->
    <div style="padding-top: 10px" v-if="formType === 'input'">
      <el-input v-model="componentConfig.options[formKey]"></el-input>
    </div>
    <!-- 默认插槽 -->
    <div
      style="padding-top: 10px"
      v-if="componentConfig.options[config.key] === 'radio-button-default'"
    >
      <slot name="default"></slot>
    </div>
    <!-- 接口数据配置 -->
    <div
      style="padding-top: 10px"
      v-if="componentConfig.options[config.key] === 'radio-button-interface'"
    >
      <el-select
        v-model="interfaceDataConfig.apiId"
        placeholder="请选择后端服务"
        @change="queryApi"
        key="interfaceDataConfigId"
      >
        <el-option
          v-for="item in interfaceApiAll"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="interfaceDataConfig.key"
        placeholder="请选择数据"
        style="padding-top: 10px"
        @change="chooseInterfaceDataKey"
        key="interfaceDataConfigKey"
      >
        <el-option
          v-for="(value, key) in apiInterfaceData"
          :key="key"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 图片配置 -->
    <div
      style="padding-top: 10px"
      v-if="
        componentConfig.options[config.key] === 'radio-button-interface-image'
      "
    >
      <el-select
        v-model="interfaceDataConfig.apiId"
        placeholder="请选择后端服务"
        @change="queryApi"
        key="interfaceDataConfigId"
      >
        <el-option
          v-for="item in interfaceApiAll"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="interfaceDataConfig.key"
        placeholder="请选择数据"
        style="padding-top: 10px"
        @change="chooseInterfaceDataKey"
        key="interfaceDataConfigKey"
      >
        <el-option
          v-for="(value, key) in apiInterfaceData"
          :key="key"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 回显接口配置 -->
    <div
      style="padding-top: 10px"
      v-if="
        componentConfig.options[config.key] === 'radio-button-interface-echo'
      "
    >
      <el-select
        v-model="interfaceDataConfig.apiId"
        placeholder="请选择后端服务"
        @change="queryApi"
        key="interfaceDataConfigId"
      >
        <el-option
          v-for="item in interfaceApiAll"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="interfaceDataConfig.key"
        placeholder="请选择数据"
        style="padding-top: 10px"
        @change="chooseInterfaceDataEchoKey"
        key="interfaceDataConfigKey"
      >
        <el-option
          v-for="(value, key) in apiInterfaceData"
          :key="key"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 数据集配置 -->
    <div
      style="padding-top: 10px"
      v-if="componentConfig.options[config.key] === 'radio-button-dataset'"
    >
      <el-select
        v-model="interfaceDataConfig.dataSetId"
        placeholder="请选择数据集"
        @change="queryDataset"
        key="dataSetId"
      >
        <el-option
          v-for="item in datasetList"
          :key="item.id"
          :label="item.dataSetName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 数据表配置 -->
    <div
      style="padding-top: 10px"
      v-if="componentConfig.options[config.key] === 'radio-button-tables'"
    >
      <el-select
        v-model="interfaceDataConfig.tableId"
        placeholder="请选择数据表"
        @change="queryDataTableField"
        key="tableId"
      >
        <el-option
          v-for="item in tablesListApi"
          :key="item.tableId"
          :label="item.tableName"
          :value="item.tableId"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 数据绑定配置 -->
    <div
      style="padding-top: 10px"
      v-if="componentConfig.options[config.key] === 'radio-button-bind'"
    >
      <!-- <el-select v-model="interfaceDataConfig.tableId" placeholder="请选择数据表" @change="queryDataTableField" key="tableId">
        <el-option
          v-for="item in tablesListApi"
          :key="item.tableId"
          :label="item.tableName"
          :value="item.tableId">
        </el-option>
      </el-select> -->

      <el-select
        v-model="interfaceDataConfig.bindDataKey"
        filterable
        placeholder="请选择"
        style="padding-top: 10px"
        @change="onChangeBindDataKey"
      >
        <el-option
          v-for="(value, key) in dataOriginComponentVarDataObjMap"
          :key="key"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 图表配置 -->
    <div
      v-if="
        formType === 'interface-chart-histogram' &&
        [
          'radio-button-tables',
          'radio-button-dataset',
          'radio-button-interface',
        ].indexOf(componentConfig.options[config.key]) !== -1 &&
        interfaceDataConfig.chartSettings
      "
    >
      <el-form-item
        style="padding-top: 10px"
        v-if="selectedChartDataList.length"
      >
        <span>横轴：</span>
        <el-select
          v-model="interfaceDataConfig.chartSettings.dimension"
          placeholder="请选择"
          :multiple="
            typeof interfaceDataConfig.chartSettings.dimension === 'object'
          "
          key="dimension"
        >
          <el-option
            v-for="(value, key) in selectedChartDataList[0]"
            :key="key"
            :label="key"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        style="padding-top: 10px"
        v-if="selectedChartDataList.length"
      >
        <span>纵轴：</span>
        <el-select
          v-model="interfaceDataConfig.chartSettings.metrics"
          placeholder="请选择"
          :multiple="
            typeof interfaceDataConfig.chartSettings.metrics === 'object'
          "
          key="metrics"
        >
          <el-option
            v-for="(value, key) in selectedChartDataList[0]"
            :key="key"
            :label="key"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        style="padding-top: 10px"
        v-if="
          selectedChartDataList.length &&
          !!interfaceDataConfig.chartSettings.showLine
        "
      >
        <span>线性：</span>
        <el-select
          v-model="interfaceDataConfig.chartSettings.showLine"
          placeholder="请选择"
          multiple
          key="showLine"
        >
          <el-option
            v-for="(value, key) in selectedChartDataList[0]"
            :key="key"
            :label="key"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <!-- 数据配置插槽 -->
    <slot
      name="dataConfig"
      :datasetParamsList="
        componentConfig.options[config.key] === 'radio-button-tables'
          ? tableFieldList
          : datasetParamsList
      "
      v-if="componentConfig.options[config.key] !== 'radio-button-default'"
    ></slot>
    <!-- 图片配置(静态) -->
    <div style="padding-top: 10px" v-if="formType === 'img-upload'">
      <slot name="img-upload"></slot>
    </div>
    <!-- 参数配置 -->
    <div
      v-if="componentConfig.options[config.key] === 'radio-button-interface'"
    >
      <el-form-item style="padding-top: 10px" label="参数配置">
        <el-collapse v-model="paramsActiveNames">
          <el-collapse-item
            :name="index"
            v-for="(item, index) in interfaceDataConfig.paramsConfigs"
            :key="index"
          >
            <template slot="title">
              {{ item.param_name }}
              <el-button
                class="panel-del-btn"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                @click="handleOptionsRemove(index)"
              />
            </template>
            <el-form
              size="small"
              label-width="70px"
              style="padding-left: 20px"
              class="label-left"
            >
              <el-form-item label="参数名：">
                <el-select
                  v-model="item.param_name"
                  placeholder="请选择"
                  v-if="processApiParamsList && processApiParamsList.length"
                >
                  <el-option
                    v-for="item in processApiParamsList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
                <el-input v-model="item.param_name" v-else></el-input>
              </el-form-item>
              <el-form-item label="参数值：">
                <el-radio-group
                  v-model="item.param_value_type"
                  size="small"
                  style="padding-bottom: 10px"
                >
                  <el-radio-button
                    :label="radioItem.value"
                    v-for="(radioItem, key) in [
                      { label: '组件', value: 'T' },
                      { label: '变量', value: 'V' },
                    ]"
                    :key="key"
                    >{{ radioItem.label }}</el-radio-button
                  >
                  <el-select
                    v-if="item.param_value_type === 'T'"
                    v-model="item.relevanceComponentUuid"
                    filterable
                    placeholder="请选择"
                    @change="linkComponent(item)"
                    style="padding-top: 10px"
                  >
                    <el-option
                      v-for="(uuidItem, key) in componentUuidList"
                      :key="key"
                      :label="uuidItem.options.commonConfigAssignName"
                      :value="uuidItem.uuid"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-if="item.param_value_type === 'V'"
                    v-model="item.param_value"
                    filterable
                    placeholder="请选择"
                    style="padding-top: 10px"
                  >
                    <el-option
                      v-for="(value, key) in varDataObj"
                      :key="key"
                      :label="key"
                      :value="value"
                    >
                    </el-option>
                  </el-select>
                </el-radio-group>
              </el-form-item>
              <!-- <el-form-item label="关联组件：">
                <el-select v-model="item.relevanceComponentUuid" filterable placeholder="请选择" @change="linkComponent(item)">
                  <el-option
                    v-for="(uuidItem, key) in componentUuidList"
                    :key="key"
                    :label="uuidItem.options.commonConfigAssignName"
                    :value="uuidItem.uuid">
                  </el-option>
                </el-select>
              </el-form-item> -->
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <div style="margin-left: 20px">
          <el-button type="text" @click="handleAddColumn">添加参数</el-button>
        </div>
      </el-form-item>
    </div>
    <!-- 回显参数配置 -->
    <div
      v-if="
        componentConfig.options[config.key] === 'radio-button-interface-echo'
      "
    >
      <el-form-item style="padding-top: 10px" label="参数配置">
        <el-collapse v-model="paramsActiveNames">
          <el-collapse-item
            :name="index"
            v-for="(item, index) in interfaceDataConfig.paramsConfigs"
            :key="index"
          >
            <template slot="title">
              {{ item.param_name }}
              <el-button
                class="panel-del-btn"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                @click="handleOptionsRemove(index)"
              />
            </template>
            <el-form
              size="small"
              label-width="70px"
              style="padding-left: 20px"
              class="label-left"
            >
              <el-form-item label="参数名：">
                <el-select
                  v-model="item.param_name"
                  placeholder="请选择"
                  v-if="processApiParamsList && processApiParamsList.length"
                >
                  <el-option
                    v-for="item in processApiParamsList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
                <el-input v-model="item.param_name" v-else></el-input>
              </el-form-item>
              <el-form-item label="参数值：">
                <el-radio-group
                  v-model="item.param_value_type"
                  size="small"
                  style="padding-bottom: 10px"
                >
                  <el-radio-button
                    :label="radioItem.value"
                    v-for="(radioItem, key) in [
                      { label: '组件', value: 'T' },
                      { label: '变量', value: 'V' },
                    ]"
                    :key="key"
                    >{{ radioItem.label }}</el-radio-button
                  >
                  <el-select
                    v-if="item.param_value_type === 'T'"
                    v-model="item.relevanceComponentUuid"
                    filterable
                    placeholder="请选择"
                    @change="linkComponent(item)"
                    style="padding-top: 10px"
                  >
                    <el-option
                      v-for="(uuidItem, key) in componentUuidList"
                      :key="key"
                      :label="uuidItem.options.commonConfigAssignName"
                      :value="uuidItem.uuid"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-if="item.param_value_type === 'V'"
                    v-model="item.param_value"
                    filterable
                    placeholder="请选择"
                    style="padding-top: 10px"
                  >
                    <el-option
                      v-for="(value, key) in varDataObj"
                      :key="key"
                      :label="key"
                      :value="value"
                    >
                    </el-option>
                  </el-select>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <div style="margin-left: 20px">
          <el-button type="text" @click="handleAddColumn">添加参数</el-button>
        </div>
      </el-form-item>
    </div>
    <!-- 查询条件 -->
    <div
      v-if="
        ['radio-button-dataset', 'radio-button-tables'].indexOf(
          componentConfig.options[config.key]
        ) !== -1
      "
    >
      <el-form-item style="padding-top: 10px" label="查询条件">
        <el-collapse v-model="queryActiveNames">
          <el-collapse-item
            :name="index"
            v-for="(item, index) in interfaceDataConfig.queryConfigs"
            :key="index"
          >
            <template slot="title">
              {{ item.param_name }}
              <el-button
                class="panel-del-btn"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                @click="handleOptionsRemoveCondition(index)"
              />
            </template>
            <el-form
              size="small"
              label-width="70px"
              style="padding-left: 20px"
              class="label-left"
            >
              <el-form-item label="列名：">
                <el-select
                  v-model="item.param_name"
                  placeholder="请选择"
                  @change="changeItemName(item, tableFieldList)"
                  v-if="
                    componentConfig.options[config.key] ===
                    'radio-button-tables'
                  "
                >
                  <el-option
                    v-for="(apiParams, key) in tableFieldList"
                    :key="key"
                    :label="apiParams.name"
                    :value="apiParams.name"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="item.param_name"
                  placeholder="请选择"
                  @change="changeItemName(item, datasetParamsList)"
                  v-else
                >
                  <el-option
                    v-for="(apiParams, key) in datasetParamsList"
                    :key="key"
                    :label="apiParams.name"
                    :value="apiParams.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运算符：">
                <el-select
                  v-model="item.operator"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="operator in operatorMap"
                    :key="operator.value"
                    :label="operator.name"
                    :value="operator.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="条件值：">
                <el-radio-group
                  v-model="item.param_value_type"
                  size="small"
                  style="padding-bottom: 10px"
                >
                  <el-radio-button
                    :label="condition.value"
                    v-for="(condition, key) in [
                      { name: '组件', value: 'T' },
                      { name: '变量', value: 'V' },
                      { name: '常量', value: 'C' },
                    ]"
                    :key="key"
                  >
                    {{ condition.name }}
                  </el-radio-button>
                </el-radio-group>
                <el-form-item label="" v-if="item.param_value_type === 'T'">
                  <el-select
                    v-model="item.relevanceComponentUuid"
                    filterable
                    placeholder="请选择"
                    @change="linkComponent(item)"
                  >
                    <el-option
                      v-for="(uuidItem, key) in componentUuidList"
                      :key="key"
                      :label="uuidItem.type + '-' + uuidItem.uuid"
                      :value="uuidItem.uuid"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" v-if="item.param_value_type === 'V'">
                  <el-select
                    v-model="item.param_value"
                    filterable
                    placeholder="请选择"
                    style="padding-top: 10px"
                  >
                    <el-option
                      v-for="(value, key) in varDataObj"
                      :key="key"
                      :label="key"
                      :value="value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <div style="padding-top: 10px" v-else>
                  <el-input v-model="item.param_value"></el-input>
                </div>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <div style="margin-left: 20px">
          <el-button type="text" @click="handleAddColumnCondition"
            >添加条件</el-button
          >
        </div>
      </el-form-item>
    </div>
  </el-radio-group>
</template>

<style lang="scss" scoped>
.border-config {
  width: 100%;
  display: flex;
  margin-bottom: 5px;
  .space_border_size {
    width: 120px;
    border: none;
    border-bottom: 1px solid #ccc;
    height: 28px;
    margin: 0 4px;
  }
}
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}
/deep/.el-collapse-item__header {
  padding-left: 20px;
}
/deep/.el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 0 10px;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 0;
}
// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
}
</style>
