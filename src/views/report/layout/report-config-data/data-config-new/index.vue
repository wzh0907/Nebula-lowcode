<template>
  <div>
    <dataSourceApiConfigNew />
    <div>
      <div style="padding: 10px 0px">
        <span style="font-weight: bold">
          数据配置
          <el-tooltip effect="dark" content="配置组件的数据使用方式" placement="top">
            <i class="el-icon-info" style="cursor: pointer;"></i>
          </el-tooltip>
        </span>
      </div>
      <componentDataConfig :componentConfig="componentConfig" :deviceDesignType="deviceDesignType" :componentUuidList="componentUuidList" v-if="updateComponentDataConfig" />
    </div>
    <!-- pop -->
    <addDataDialog
      :visible="addDataDialogVisible"
      @onClose="addDataDialogVisible = false"
      @onSubmit="onAddDataDialogSubmit"
    />
  </div>
</template>

<script>
// TODO:: 只对列表组件van-design-list以uuid为key进行数据缓存，可能会对其他某些组件造成影响，待测试
import { pickInputComponentList } from "@/views/report/utils/deal-component-data/transform-component-list";
import addDataDialog from "./dialog/add-data-dialog.vue";
import componentDataConfig from "./modules/component-config/index.vue";
import interfaceConfig from "./modules/interface-config/index.vue";
import dataSourceApiConfigNew from "./data-source-api-config-new.vue";
export default {
  components: {
    addDataDialog,
    componentDataConfig,
    interfaceConfig,
    dataSourceApiConfigNew
  },
  props: {
    deviceDesignType: {
      type: String,
      default: "MOBILE",
    },
    componentList: {
      type: Array,
      default: [],
    },
    componentConfig: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dataActiveName: "",
      addDataDialogVisible: false,
      interfaceData: [],
      interfaceDataTypeDict: {
        "radio-button-interface": "后端服务",
        "radio-button-tables": "数据表",
        "radio-button-dataset": "SQL脚本",
        'radio-button-view': '视图',
        // 'radio-button-sql': 'SQL脚本'
      },
      componentUuidList: [],
      updateComponentDataConfig: true
    };
  },
  watch: {
    componentConfig: {
      handler(){
        this.updateComponentDataConfig = false
        this.$nextTick(() => {
          this.updateComponentDataConfig = true
        })
      }
    }
  },
  created() {
    this.interfaceData = this.$pageDataModelEngine.getInterfaceData();
    this.filterInputComment();
  },
  mounted() {

  },
  methods: {
    // 拿到过滤后的 input 组件
    filterInputComment() {
      let tempArr = [];
      this.pickInputComponentList(this.componentList, tempArr);
      this.componentUuidList = tempArr;
    },
    pickInputComponentList,
    onAddDataDialogSubmit(data) {
      this.addDataDialogVisible = false;
      this.$pageDataModelEngine.saveInterfaceData(data);

    },
    onDelInterfaceData(index) {
      this.$pageDataModelEngine.deleteInterfaceData(index);
    },
  },
};
</script>
<style scoped lang="scss">
.panel-add-btn {
  position: absolute;
  right: 40px;
  padding: 4px;
}
.panel-del-btn {
  position: absolute;
  right: 40px;
  padding: 4px;
}
</style>
