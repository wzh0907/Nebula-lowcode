<template>
  <div style="padding-left: 20px;">
    <div v-if="containInputForm">
      <InputConfig :componentConfig="componentConfig" @onUpdateOptionsConfig="onUpdateOptionsConfig" />
    </div>
    <div v-else-if="isSwiper">
      <SwiperConfig :componentConfig="componentConfig" @onUpdateOptionsConfig="onUpdateOptionsConfig" />
    </div>
    <div v-else-if="isWorkflow">
      <WorkflowConfig :componentConfig="componentConfig" @onUpdateOptionsConfig="onUpdateOptionsConfig" />
    </div>
    <div v-else-if="isCascade">
      <CascadeConfig
        :componentConfig="componentConfig"
        @onUpdateOptionsConfig="onUpdateOptionsConfig"
        @onChangeDataConfigOptions="onChangeDataConfigOptions"/>
      <InputConfig
        :componentConfig="componentConfig"
        @onUpdateOptionsConfig="onUpdateOptionsConfig" />
    </div>
    <div v-else-if="isTree">
      <TreeConfig
        :componentConfig="componentConfig"
        @onUpdateOptionsConfig="onUpdateOptionsConfig"
        @onChangeDataConfigOptions="onChangeDataConfigOptions"/>
      <InputConfig
        :componentConfig="componentConfig"
        @onUpdateOptionsConfig="onUpdateOptionsConfig" />
    </div>
    <div v-else>
      <span v-if="!componentConfig.options._data_origin_component_uuid" style="font-weight: bold; margin-right: 8px">值配置</span>
      <!-- 选择数据源 -->
      <valuesConfig
        v-if="!componentConfig.options._data_origin_component_uuid"
        :componentConfig="componentConfig"
        @onUpdateOptionsConfig="onUpdateOptionsConfig"
        @onChangeDataConfigOptions="onChangeDataConfigOptions"/>
      <!-- 字段选项 -->
      <optionsConfig :componentConfig="componentConfig" :deviceDesignType="deviceDesignType" :componentUuidList="componentUuidList" v-if="updateOptionsConfig" />
      <!-- 记录行数 Table组件专属配置 -->
      <TablePagingConfig :componentConfig="componentConfig" :dataConfigOptions="dataConfigOptions" v-if="componentConfig.type === 'van-design-table'" />
      <!-- 行选择 Table组件专属配置 -->
      <TableRowSelectConfig :componentConfig="componentConfig" v-if="componentConfig.type === 'van-design-table'" />
      <TableRowSelectEchoConfig :componentConfig="componentConfig" :dataConfigOptions="dataConfigOptions" v-if="componentConfig.type === 'van-design-table'" />
      <!-- 全局变量 弃用 -->
      <!-- <global-config :componentConfig="componentConfig"  /> -->
    </div>

  </div>
</template>

<script>
// modules
import valuesConfig from "./values-config.vue";
import optionsConfig from "./options-config.vue";
import GlobalConfig from './global-config.vue';
import InputConfig from './input-config.vue';
import SwiperConfig from './swiper-config.vue';
import WorkflowConfig from './workflow-config.vue';
import TablePagingConfig from './table-config/paging-config.vue'
import TableRowSelectConfig from './table-config/row-select-config.vue'
import TableRowSelectEchoConfig from './table-config/row-select-echo.vue'
import CascadeConfig from "./slots/cascade-config.vue"
import TreeConfig from "./slots/tree-selector-config"
import {inputFormComponent} from "@/views/report/utils/common-const.js";
import mockDialog from "../../dialog/mock-dialog-comp";

export default {
  components: {
    valuesConfig,
    optionsConfig,
    GlobalConfig,
    InputConfig,
    SwiperConfig,
    TablePagingConfig,
    TableRowSelectConfig,
    TableRowSelectEchoConfig,
    WorkflowConfig,
    CascadeConfig,
    TreeConfig,
    mockDialog
  },
  props: {
    componentConfig: {
      type: Object,
      default: {},
    },
    deviceDesignType: {
      type: String,
      default: "MOBILE",
    },
    componentUuidList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      updateOptionsConfig: true,
      dataConfigOptions: [],
      mockChecked: false,
      mockDialogVisible: false,
    };
  },
  computed: {
    containInputForm(){
      return inputFormComponent.indexOf(this.componentConfig.type) !== -1;
      //  return false;
    },
    isSwiper(){
      return this.componentConfig.type=='van-design-swipe';
    },
    isWorkflow(){
       return this.componentConfig.type=='van-design-workflow';
    },
    isCascade() {
      return this.componentConfig.type=='van-design-cascade';
    },
    isTree() {
      return this.componentConfig.type=='van-design-tree-select' || this.componentConfig.type=='van-design-tree';
    }
  },
  created() {

  },
  mounted() {},
  methods: {
    openMockDialog(item){
      this.mockDialogVisible = true;
      // this.mockItem = item;
    },
    onMockDataDialogSubmit(mockData){
      // this.mockItem.data.responseData=JSON.parse(mockData);
      // console.log("onMockDataDialogSubmit",this.mockItem, mockData)
    },
    onChangeDataConfigOptions(dataConfigOptions) {
      function deepFn(item) {
        item._id = item.value.id
        if (item.children) {
          item.children.forEach(item => {
            deepFn(item)
          })
        }
      }
      dataConfigOptions.forEach(item => {
        deepFn(item)
        // item._id = item.value.id
        // if (item.children) {
        //   item.children.forEach(item => {
        //     item._id = item.value.id
        //     if (item.children) {
        //       item.children.forEach(item => {
        //         item._id = item.value.id
        //       })
        //     }
        //   })
        // }
      })
      // console.log('xxxxxxxxxxxxxxxxxxxxx', dataConfigOptions)
      this.dataConfigOptions = dataConfigOptions
    },
    onUpdateOptionsConfig(){
      this.updateOptionsConfig = false
      this.$nextTick(() => {
        this.updateOptionsConfig = true
      })
    }
  }
};
</script>
<style scoped lang="scss">
/deep/.el-cascader .el-input .el-input__inner::-webkit-input-placeholder {
  color: #333;
}

.mock-button {
  color: #606666;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  cursor: pointer;
}
</style>
