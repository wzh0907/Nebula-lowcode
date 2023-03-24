<template>
  <div>
    <!-- 图表配置 -->
    <div v-if="componentConfig.options.interfaceDataConfig.chartSettings && componentConfig.options.interfaceDataConfig.tableData">
      <span style="font-weight: bold;">选项配置
        <el-tooltip effect="dark" content="刷新配置" placement="top">
          <i
            class="refresh-icon iconfont iconshuaxin"
            alt="刷新"
            @click="refreshInterface"
          ></i>
        </el-tooltip>
      </span>
      <chartDataConfig
        style="padding: 10px 0px;"
        :interfaceDataConfig="componentConfig.options.interfaceDataConfig"
        :selectedChartDataList="componentConfig.options.interfaceDataConfig.tableData"
      />
    </div>
    <!-- 表单配置 -->
    <div v-else-if="formComponentTypeList.indexOf(componentConfig.type) !== -1">
      <div>
        <span style="font-weight: bold;">选项配置</span>
        <!-- 表单 -->
        <slotSelectConfig slot="global-default" :componentConfig="componentConfig" style="padding: 10px 0px;" />
      </div>
      <!-- <div>
        <span style="font-weight: bold;">回显配置</span>
        <div style="padding: 10px 0px;">暂未完成</div>
      </div> -->
    </div>
    <!-- 进度条配置 -->
    <div v-else-if="componentConfig.type === 'van-design-progress'">
      <span style="font-weight: bold;">选项配置</span>
      <slotProgressConfig slot="global-default" :componentConfig="componentConfig" style="padding: 10px 0px;" />
    </div>
    <!-- PC端table配置 -->
    <div v-else-if="deviceDesignType === 'PC' && componentConfig.type === 'van-design-table'">
      <span style="font-weight: bold;">选项配置</span>
      <slotTableColumnConfig slot="dataConfig" :componentConfig="componentConfig" style="margin-top: 10px;" />
    </div>
    <!-- 移动端table配置 -->
    <div v-else-if="deviceDesignType === 'MOBILE' && componentConfig.type === 'van-design-table'">
      <span style="font-weight: bold;">选项配置</span>
      <slotMobileTableColumnConfig slot="dataConfig" :columnsConfigs="componentConfig.options.optionColumn" style="margin-top: 10px;" />
    </div>
    <!-- PC端表单配置 -->
    <div v-else-if="deviceDesignType === 'PC' && componentConfig.type === 'van-design-form'">
      <slotFormConfig slot="dataConfig" :componentConfig="componentConfig" :componentUuidList="componentUuidList" style="margin-top: 10px;" />
    </div>
    <!-- 移动端列表组件配置 -->
    <div v-else-if="(componentConfig.type === 'van-design-text'||componentConfig.type === 'van-design-image')&&componentConfig.options._data_origin_component_uuid">
      <span style="font-weight: bold;">
        数据绑定
        <el-tooltip effect="dark" content="使用列表的模板数据时需要配置数据绑定" placement="top">
          <i class="el-icon-info" style="cursor: pointer;"></i>
        </el-tooltip>
      </span>
      <slotTextBindDataConfig :componentConfig="componentConfig" />
    </div>
  </div>
</template>

<script>
import chartDataConfig from "./slots/chart-config.vue";
import slotSelectConfig from "./slots/select-config.vue";
import slotProgressConfig from "./slots/progress-config.vue";
import slotTableColumnConfig from "./slots/table-column-config.vue";
import slotMobileTableColumnConfig from "./slots/mobile-table-column-config.vue";
import slotFormConfig from "./slots/form-config.vue";
import slotTextBindDataConfig from './slots/text-bind-data-config.vue';
export default {
  components: {
    chartDataConfig,
    slotSelectConfig,
    slotProgressConfig,
    slotTableColumnConfig,
    slotMobileTableColumnConfig,
    slotFormConfig,
    slotTextBindDataConfig
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
  created(){
  },
  data() {
    return {
      formComponentTypeList: [
        "van-design-select",
        "van-design-checkbox",
        "van-design-radio",
      ],
    };
  },
  methods:{
    refreshInterface(){
      let temp = this.$pageDataModelEngine.updateInterfaceData(
        this.componentConfig.options.interfaceDataConfig.uuid
      );

      let rData =
        temp.data.responseData[
          this.componentConfig.options.interfaceDataConfig.key
        ];
        this.componentConfig.options.interfaceDataConfig.tableData = rData;
    }
  }
};
</script>
<style scoped lang="scss">
/deep/.el-cascader .el-input .el-input__inner::-webkit-input-placeholder {
  color: #333;
}
.refresh-icon{
  cursor: pointer;
}
</style>
