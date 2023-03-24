<template>
  <div>
    <el-form size="small" label-width="70px" class="label-left">
      <el-form-item
        :label="item.param_name"
        v-for="(item, index) in paramsConfigs"
        :key="index"
      >
        <valueSelect
          :paramItem="item"
          @handleChange="handleChange"
          style="padding: 10px 0px"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import valueSelect from "./value-select.vue";
export default {
  components: { valueSelect },
  props: {
    interfaceDataConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 可输入组件的list
    componentUuidList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      varDataObj: {},
      cascaderValueTemp: {},
      dataConfigOptions: [],
      paramsActiveNames: "",
      processApiParamsList: [],
      paramsConfigs: [],
    };
  },
  watch: {},
  created() {
    console.log("create", this.chooseSubpageIndex);
    if (!this.interfaceDataConfig.paramsConfigs) {
      this.$set(this.interfaceDataConfig, "paramsConfigs", []);
    }
    this.paramsConfigs = this.interfaceDataConfig.paramsConfigs;
    this.varDataObj = this.$pageDataModelEngine.getCustomData();
    for (var key in this.varDataObj) {
      if (
        this.varDataObj[key].type &&
        this.varDataObj[key].type == "pageParam"
      ) {
        if (this.varDataObj[key].linkPageIndex != this.chooseSubpageIndex) {
          delete this.varDataObj[key];
        }
      }
    }
    this.initDataConfigOptions();
  },
  mounted() {},
  methods: {
    initDataConfigOptions() {
      this.dataConfigOptions = [
        // {
        //   value: {
        //     type: 'radio-button-default',
        //     id: 'radio-button-default',
        //     data: {}
        //   },
        //   label: '静态值',
        // },
        {
          value: {
            type: "custom",
            id: "custom",
            data: {},
          },
          label: "页面入参",
          children: this.customOptions,
        },
        {
          value: {
            type: "component",
            id: "component",
            data: {},
          },
          label: "组件",
          children: this.componentOptions,
        },
      ];
    },
    onSelectParamKey(item) {
      let iValue = this.varDataObj[item.param_v_key];
      // 2021-07-01 临时方案
      if (typeof iValue == "object") {
        item.param_value = iValue.value;
      } else {
        item.param_value = this.varDataObj[item.param_v_key];
      }
    },
    linkComponent(paramsItem) {
      let uuid = paramsItem.relevanceComponentUuid;
      this.componentUuidList.forEach((item) => {
        if (item.uuid === uuid) {
          paramsItem.param_value = item.options.value;
        }
      });
    },
    handleOptionsRemove(index) {
      this.interfaceDataConfig.paramsConfigs.splice(index, 1);
    },

    handleChange(data, paramItem) {
      console.log("handleChange", data, paramItem);
      if (data.length > 0) {
        if (paramItem.param_value_type == "T") {
          if (data.length === 3) {
            paramItem.relevanceComponentUuid = data[1].id;
            // TODO:: 待优化 目前组件有三层的是Table组件（特殊处理）
            paramItem.param_v_key = data[2].data.value;
            paramItem.param_v_key === 'rownum' && (paramItem.param_value = 10)
            paramItem.param_v_key === 'pagenum' && (paramItem.param_value = 1)
          } else {
            paramItem.relevanceComponentUuid = data[1].id;
            this.linkComponent(paramItem);
          }
        } else if (paramItem.param_value_type == "G"){
          
        }else {
          paramItem.param_v_key = data[1].id;
          paramItem.param_value = data[1].data.value.operateHrefPageParamValue;
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
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
  padding: 10px 0 10px;
  word-wrap: break-word;
}
/deep/.el-collapse-item__arrow {
  position: absolute;
  margin: 0;
  left: 25px;
}
// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
}
</style>
